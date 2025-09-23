<template>
  <c-card
    ref="deleteObjsModal"
    class="delete-modal"
    @keydown="handleKeyDown"
  >
    <c-card
      ref="deleteObjsModal"
      class="delete-modal"
      @keydown="handleKeyDown"
    >
      <c-alert
        v-if="!isDeleting"
        type="error"
      >
        <div slot="title">
          {{ $t("message.objects.deleteObjects") }}
        </div>

        {{ owner ?
          $t("message.objects.deleteSharedObjects") :
          $t("message.objects.deleteObjectsMessage")
        }}

        <c-card-actions justify="end">
          <c-button
            outlined
            @click="toggleDeleteModal(false)"
            @keyup.enter="toggleDeleteModal(true)"
          >
            {{ $t("message.cancel") }}
          </c-button>
          <c-button
            id="delete-objs-btn"
            data-testid="confirm-delete-objects"
            @click="deleteObjects()"
            @keyup.enter="deleteObjects()"
          >
            {{ $t("message.objects.deleteConfirm") }}
          </c-button>
        </c-card-actions>
      </c-alert>
      <c-alert
        v-else
        type="success"
      >
        <div slot="title">
          {{ $t("message.objects.deleteInProgress") }}
        </div>
        <c-progress-bar
          single-line
          indeterminate
        />
      </c-alert>
    </c-card>
  </c-card>
</template>

<script>
import { swiftDeleteObjects, getObjects, swiftDeleteContainer, removeAccessControlMeta } from "@/common/api";
import { deleteStaleSharedContainers } from "@/common/conv";
import { getDB } from "@/common/db";

import { isFile } from "@/common/globalFunctions";
import {
  getFocusableElements,
  addFocusClass,
  removeFocusClass,
  moveFocusOutOfModal,
} from "@/common/keyboardNavigation";

export default {
  name: "DeleteModal",
  data() {
    return {
      isDeleting: false,
    };
  },
  computed: {
    selectedObjects() {
      return this.$store.state.deletableObjects.length > 0
        ? this.$store.state.deletableObjects
        : [];
    },
    subfolders() {
      return this.$route.query.prefix ?
        this.$route.query.prefix.split("/") : [];
    },
    prefix() {
      return this.$route.query.prefix;
    },
    projectID() {
      return this.$route.params.project;
    },
    container() {
      return this.$route.params.container;
    },
    owner() {
      return this.$route.params.owner;
    },
    renderedFolders() {
      return this.$store.state.renderedFolders;
    },
    modalVisible() {
      return this.$store.state.openDeleteModal;
    },
  },
  watch: {
    modalVisible() {
      if (this.modalVisible) this.isDeleting = false;
    },
  },
  methods: {
    toggleDeleteModal: function(keypress) {
      this.$store.commit("toggleDeleteModal", false);
      this.$store.commit("setDeletableObjects", []);

      /*
        Prev Active element is a popup menu and it is removed from DOM
        when we click it to open Delete Modal.
        Therefore, we need to make its focusable parent
        to be focused instead after we close the modal.
      */
      if (keypress) {
        const prevActiveElParent = document.getElementById("obj-table");
        moveFocusOutOfModal(prevActiveElParent, true);
      }
    },
    deleteObjects: async function () {
      let switchAlertType = false;
      setTimeout(() => {
        // to avoid alert flashing
        // switch type only if mid-deletion after 250ms
        switchAlertType = true;
      }, 250);

      // Utility to get unique values from an array
      const unique = (arr) => Array.from(new Set(arr));
      const BATCH = 1000;
      const batchDelete = async (keys, projectID, containerName) => {
        for (let i = 0; i < keys.length; i += BATCH) {
          const chunk = keys.slice(i, i + BATCH);
          await swiftDeleteObjects(projectID, containerName, chunk);
        }
      };

      // list all files under a given folder recursively from IndexedDB
      const expandFolderToKeys = async (folderName) => {
        const prefix = folderName.endsWith("/") ? folderName : `${folderName}/`;
        const files = await getDB().objects
          .filter(obj => obj.container === this.container && obj.name.startsWith(prefix))
          .toArray();
        return files.map(f => f.name);
      };

      // Delete all objects in a container using pagination
      const deleteContainerObjectsByMarker = async (projectID, contName) => {
        let marker = ""; // first page
        while (true) {
          // get next page of objects
          const page = await getObjects(projectID, contName, marker) || [];
          if (!page.length) break;

          // delete this page of objects
          const keys = page.map(o => o.name);
          await batchDelete(keys, projectID, contName);

          // set marker for next page
          marker = page[page.length - 1].name;
        }
      };

      // Check if we are deleting a bucket
      const isContainerDeletion =
      this.selectedObjects?.length &&
      this.selectedObjects[0]?.isContainer === true;

      // Delete a bucket and all its contents
      if (isContainerDeletion) {
        if (!this.isDeleting && switchAlertType) this.isDeleting = true;

        const containerName = this.selectedObjects[0].name; // bucket to delete
        const projectForCalls = this.owner || this.projectID; // projectID

        // Delete all objects in the main bucket using pagination
        await deleteContainerObjectsByMarker(projectForCalls, containerName);

        // Delete segments buckets if exists and its objects
        const segContainer = `${containerName}_segments`;
        try {
          await deleteContainerObjectsByMarker(projectForCalls, segContainer);
          try { await swiftDeleteContainer(projectForCalls, segContainer); } catch (e) {}
        } catch (e) {}

        // Delete the main bucket
        await swiftDeleteContainer(this.owner || this.projectID, containerName);

        // If shared, remove access control metadata and clean up stale shares
        try {
          const sharedDetails = await this.$store.state.client.getShareDetails(
            this.projectID,
            containerName
          );

          if (sharedDetails?.length) {
            await removeAccessControlMeta(this.projectID, containerName);
            await deleteStaleSharedContainers(this.$store);
          }
        } catch (e) {}

        // Delete from IndexedDB
        const db = getDB();
        const cont = await db.containers.get({ projectID: this.projectID, name: containerName });
        if (cont) {
          const objs = await db.objects.where({ containerID: cont.id }).toArray();
          if (objs?.length) await db.objects.bulkDelete(objs.map(o => o.id));
          await db.containers.delete(cont.id);
        }

        // Show success message
        document.querySelector("#container-toasts")?.addToast({
          progress: false,
          type: "success",
          message: this.$t("message.container_ops.deleteSuccess"),
        });

        try {
          await this.$store.dispatch("updateContainers", {
            projectID: this.projectID,
          });
        } catch (e) {}

        this.toggleDeleteModal();
        return; // bucket flow done
      }

      // File / folder (prefix) deletion inside a bucket
      let to_remove = [];
      let segments_to_remove = []; // Array for segment objects to be deleted
      let segment_container = null;

      const isSegmentsContainer = this.container.endsWith("_segments");

      if (!isSegmentsContainer && this.selectedObjects?.length) {
        // find sibling segments bucket for the SAME main bucket
        segment_container = await getDB().containers.get({
          projectID: this.projectID,
          name: `${this.selectedObjects[0].container}_segments`,
        });
      }

      // Pre-fetch segment objects if segment container exists
      let segment_objects = [];
      if (segment_container) {
        try {
          segment_objects = await getObjects(
            this.owner || this.projectID,
            segment_container.name
          );
        } catch (e) {
          segment_objects = [];
        }
      }

      for (const object of this.selectedObjects) {
        if (switchAlertType && !this.isDeleting) this.isDeleting = true;

        // Check if the object is a file or if we are showing full paths
        const isAFile = isFile(object.name, this.$route);
        const showingFullPaths = !this.renderedFolders;

        if (isAFile || showingFullPaths) {
          // Files or when displaying full paths: direct delete
          to_remove.push(object.name);

          if (segment_container && segment_objects.length) {
            for (const seg of segment_objects) {
              if (seg.name.includes(`${object.name}/`)) {
                segments_to_remove.push(seg.name);
              }
            }
          }
        } else {
           // Folders: need to expand to all files inside
           const folderFiles = await expandFolderToKeys(object.name);
           to_remove.push(...folderFiles);

           // Also delete any segments that match the folder prefix
           if (segment_container && segment_objects.length && folderFiles.length) {
            const prefixNorm = object.name.endsWith("/") ? object.name : `${object.name}/`;
            for (const seg of segment_objects) {
              if (seg.name.startsWith(prefixNorm) || folderFiles.some(f => seg.name.includes(`${f}/`))) {
                segments_to_remove.push(seg.name);
              }
            }
          }
        }
      }

      // Check if any subfolder is selected for deletion
      to_remove = unique(to_remove);
      segments_to_remove = unique(segments_to_remove);

      // Perform batch deletions
      if (to_remove.length) {
        await batchDelete(to_remove, this.owner || this.projectID, this.container);
      }
      if (segment_container && segments_to_remove.length) {
        await batchDelete(segments_to_remove, this.owner || this.projectID, segment_container.name);
      }


      // Delete from IndexedDB
      const db = getDB();
      const cont = await db.containers.get({ projectID: this.projectID, name: this.container });
      if (cont && to_remove.length) {
        const rows = await db.objects
          .where({ containerID: cont.id })
          .filter(o => to_remove.includes(o.name))
          .toArray();
        if (rows.length) await db.objects.bulkDelete(rows.map(r => r.id));
      }

      // Update the store with the new object list
      try {
        await this.$store.dispatch("updateObjects", {
          projectID: this.projectID,
          container: cont,
        });
      } catch (e) {}

      // Refresh the object list after deletion
      document.getElementById("obj-table")?.clearSelections();
      this.toggleDeleteModal();
      this.getDeleteMessage(to_remove);
    },
    getDeleteMessage: async function(to_remove) {
      // Only files can be deleted
      // Show warnings when deleting subfolders
      if (to_remove.length > 0) {
        let msg;
        to_remove.length === 1?
          msg = to_remove.length + this.$t("message.objects.deleteOneSuccess")
          : msg = to_remove.length +
            this.$t("message.objects.deleteManySuccess");

        if (this.subfolders.length && this.renderedFolders) {
          //get all files uppermost subfolder contains
          const folderFiles = await getDB().objects
            .filter(obj => obj.name.startsWith(this.subfolders[0])
              && obj.container === this.container)
            .toArray();
          if (folderFiles.length < 1) {
            //if all subfolders empty, go to container
            //see if more than one subfolder removed
            this.subfolders.length > 1 ?
              msg = this.$t("message.subfolders.deleteManySuccess") :
              msg = this.$t("message.subfolders.deleteOneSuccess");
            this.$router.push({name: "ObjectsView"});
          }
          else {
            let newPrefix = this.prefix;
            for (let level=0; level < this.subfolders.length; level++) {
              let found = folderFiles.find(obj =>
                obj.name.startsWith(newPrefix));
              if (found !== undefined) {
                //if file with this prefix found
                //go to containing subfolder
                //files found at same level: leave "file(s) deleted" ^
                //otherwise show "subfolder(s) deleted"
                if (level > 0) {
                  level > 1 ?
                    msg = this.$t("message.subfolders.deleteManySuccess") :
                    msg = this.$t("message.subfolders.deleteOneSuccess");
                  let path =
                    {name: "ObjectsView", query: { prefix: newPrefix}};
                  this.$router.push(path);
                }
                break;
              } else {
                //files with this prefix not found
                //go up a subfolder and check again
                newPrefix = newPrefix
                  .substring(0, newPrefix.lastIndexOf("/"));
              }
            }
          }
        }
        document.querySelector("#objects-toasts").addToast(
          { progress: false,
            type: "success",
            message: msg,
          },
        );
      }
    },
    handleKeyDown: function (e) {
      const focusableList = this.$refs.deleteObjsModal.querySelectorAll(
        "c-button",
      );
      const { first, last } = getFocusableElements(focusableList);

      if (e.key === "Tab" && !e.shiftKey) {
        if (e.target === last) {
          removeFocusClass(last);
          first.tabIndex="0";
          first.focus();
          addFocusClass(first);
        } else if (e.target === first) {
          removeFocusClass(first);
          last.tabIndex="0";
          last.focus();
          addFocusClass(last);
        }
      }
      else if (e.key === "Tab" && e.shiftKey) {
        if (e.target === first) {
          e.preventDefault();
          last.tabIndex = "0";
          last.focus();
          if (last === document.activeElement) {
            addFocusClass(last);
          }
        } else if (e.target === last) {
          removeFocusClass(last);
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">

@import "@/css/prod.scss";

.mdi-alert-circle {
  font-size: 2.0em;
  color: $csc-red;
}

.delete-modal {
  padding: 0px;
}

c-progress-bar {
  padding: 0.5rem;
}

</style>
