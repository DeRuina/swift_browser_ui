<template>
  <c-card
    ref="uploadContainer"
    class="upload-card"
    data-testid="upload-modal"
    @keydown="handleKeyDown"
  >
    <div
      id="upload-modal-content"
      class="modal-content-wrapper"
    >
      <c-toasts
        id="uploadModal-toasts"
        data-testid="uploadModal-toasts"
        vertical="bottom"
        absolute
      />
      <h2 class="title is-4">
        {{ $t("message.encrypt.uploadFiles") }}
      </h2>
      <c-card-content>
        <div
          v-if="!currentFolder"
          id="upload-to-root"
        >
          <h3 class="title is-6">
            1. {{ $t("message.encrypt.upload_step1") }}
          </h3>
          <p class="info-text is-size-6">
            {{ $t("message.container_ops.norename") }}
          </p>
          <c-text-field
            id="upload-folder-input"
            v-model="inputFolder"
            v-csc-control
            data-testid="upload-folder-input"
            :label="$t('message.container_ops.folderName')"
            aria-required="true"
            required
            :valid="errorMsg.length === 0"
            :validation="errorMsg"
            @changeValue="interacted = true"
          />
          <h3 class="title is-6">
            2. {{ $t("message.encrypt.upload_step2") }}
          </h3>
        </div>
        <div v-else>
          <p>
            <b>{{ $t("message.encrypt.uploadDestination") }}</b>
            {{ currentFolder }}
          </p>
        </div>
        <div
          class="dropArea"
          @dragover="dragHandler"
          @dragleave="dragLeaveHandler"
          @drop="navUpload"
        >
          <span>{{ $t("message.dropFiles") }}</span>
          <CUploadButton
            v-model="files"
            v-csc-control
            @add-files="buttonAddingFiles=true"
            @cancel="buttonAddingFiles=false"
          >
            <span>
              {{ $t("message.encrypt.dropMsg") }}
            </span>
          </CUploadButton>
        </div>
        <template v-for="error in dropFileErrors">
          <c-alert
            v-if="error.show"
            :key="error.id"
            type="error"
            data-testid="drop-files-error"
          >
            <div class="drop-file-notification">
              {{ $t(`message.upload.${error.id}`) }}
              <c-button
                text
                size="small"
                @click="error.show = false"
              >
                <i
                  slot="icon"
                  class="mdi mdi-close"
                />
                {{ $t("message.close") }}
              </c-button>
            </div>
          </c-alert>
        </template>
        <c-alert
          v-show="existingFiles.length"
          type="warning"
        >
          <span
            v-if="existingFiles.length === 1"
          >
            {{ $t("message.objects.file") }}
            <b>
              {{ existingFiles[0].name }}
            </b>
            {{ $t("message.objects.overwriteConfirm") }}
          </span>
          <span
            v-else
          >
            {{ $t("message.objects.files") }}
            <b>
              {{ existingFileNames }}
            </b>
            {{ $t("message.objects.overwriteConfirmMany") }}
          </span>
          <c-card-actions justify="end">
            <c-button
              outlined
              @click="overwriteFiles"
              @keyup.enter="overwriteFiles"
            >
              {{ $t("message.objects.overwrite") }}
            </c-button>
            <c-button
              @click="clearExistingFiles"
              @keyup.enter="clearExistingFiles"
            >
              {{ $t("message.cancel") }}
            </c-button>
          </c-card-actions>
        </c-alert>
        <!-- Footer options needs to be in CamelCase,
        because csc-ui wont recognise it otherwise. -->
        <c-data-table
          v-if="dropFiles.length > 0"
          class="files-table"
          :data.prop="paginatedDropFiles"
          :headers.prop="fileHeaders"
          :no-data-text="$t('message.encrypt.empty')"
          :pagination.prop="filesPagination"
          :sort-by="sortBy"
          :sort-direction="sortDirection"
          external-data
          @click="checkPage($event,false)"
          @sort="onSort"
          @paginate="getDropTablePage"
        />
        <p
          class="info-text is-size-6"
        >
          {{ $t("message.encrypt.uploadedFiles") }}
          <b>{{ active.name }}</b>{{ !owner ? "." : " (" }}
          <c-link
            :href="projectInfoLink"
            underline
            target="_blank"
          >
            {{ $t("message.container_ops.viewProjectMembers") }}
            <i class="mdi mdi-open-in-new" />
          </c-link>
          {{ !owner ? "" :
            ") " + $t("message.encrypt.uploadedToShared") }}
        </p>
        <c-accordion id="accordion" />
      </c-card-content>
    </div>
    <c-card-actions justify="space-between">
      <c-button
        outlined
        size="large"
        @click="cancelUpload"
        @keyup.enter="cancelUpload"
      >
        {{ $t("message.encrypt.cancel") }}
      </c-button>
      <c-button
        data-testid="start-upload"
        size="large"
        :loading="addingFiles || buttonAddingFiles"
        @click="onUploadClick"
        @keyup.enter="onUploadClick"
      >
        {{ $t("message.encrypt.normup") }}
      </c-button>
    </c-card-actions>
  </c-card>
</template>

<script>
import {
  getHumanReadableSize,
  truncate,
  computeSHA256,
  sortItems,
} from "@/common/conv";
import { getDB } from "@/common/db";

import {
  getProjectNumber,
  validateFolderName,
  checkIfItemIsLastOnPage,
  addErrorToastOnMain,
} from "@/common/globalFunctions";
import {
  getFocusableElements,
  moveFocusOutOfModal,
  keyboardNavigationInsideModal,
} from "@/common/keyboardNavigation";
import CUploadButton from "@/components/CUploadButton.vue";
import { swiftDeleteObjects, getObjects, signedFetch } from "@/common/api";

import { debounce, delay } from "lodash";
import { mdiDelete } from "@mdi/js";

export default {
  name: "UploadModal",
  components: {
    CUploadButton,
  },
  filters: {
    truncate,
  },
  data() {
    return {
      inputFolder: "",
      addRecvkey: "",
      recvkeys: [],
      recvHashedKeys: [],
      CUploadButton,
      projectInfoLink: "",
      addingFiles: false,
      buttonAddingFiles: false,
      interacted: false,
      currentKeyPage: 1,
      errorMsg: "",
      toastMsg : "",
      containers: [],
      objects: [],
      existingFiles: [],
      filesToOverwrite: [],
      dropFileErrors: [
        {id: "duplicate", show: false},
        {id: "sizeZero", show: false},
      ],
      paginatedDropFiles: [],
      sortBy: "name",
      sortDirection: "asc",
      filesPagination: {
        itemCount: 0,
        itemsPerPage: 20,
        currentPage: 1,
      },
      uploadError: "",
    };
  },
  computed: {
    res() {
      return this.$store.state.resumableClient;
    },
    active() {
      return this.$store.state.active;
    },
    locale() {
      return this.$i18n.locale;
    },
    pubkey() {
      return this.$store.state.pubkey;
    },
    currentFolder() {
      return this.$route.params.container;
    },
    modalVisible() {
      return this.$store.state.openUploadModal;
    },
    owner() {
      return this.$route.params.owner;
    },
    socket() {
      return this.$store.state.socket;
    },
    abortReason() {
      return this.$store.state.uploadAbortReason;
    },
    fileHeaders() {
      return [
        {
          key: "name",
          value: this.$t("message.encrypt.table.name"),
          width: "30%",
          sortable: this.dropFiles.length > 1,
        },
        {
          key: "type",
          value: this.$t("message.encrypt.table.type"),
          width: "15%",
          sortable: this.dropFiles.length > 1,
        },
        {
          key: "size",
          value: this.$t("message.encrypt.table.size"),
          width: "10%",
          sortable: this.dropFiles.length > 1,
        },
        {
          key: "relativePath",
          value: this.$t("message.encrypt.table.path"),
          width: "30%",
          sortable: this.dropFiles.length > 1,
        },
        {
          key: "delete",
          value: null,
          sortable: false,
        },
      ];
    },
    publickeyHeaders() {
      return [
        {
          key: "key",
          value: this.$t("message.encrypt.pubkeyLabel"),
          width: "70%",
          sortable: this.recvHashedKeys.length > 1,
        },
        {
          key: "delete",
          value: null,
          sortable: false,
          children: [
            {
              value: this.$t("message.delete"),
              component: {
                tag: "c-button",
                params: {
                  text: true,
                  size: "small",
                  title: this.$t("message.delete"),
                  path: mdiDelete,
                  onClick: ({ index }) =>{
                    this.recvHashedKeys.splice(index, 1);
                    this.recvkeys.splice(index, 1);
                  },
                  onKeyUp: (e) => {
                    if(e.keyCode === 13) {
                      // Get the text value of item that is to be removed
                      const keyText = e.target.closest("tr")?.innerText;
                      // Find its index in key list
                      const index = this.recvHashedKeys.indexOf(keyText);
                      if (index !== undefined) {
                        this.recvHashedKeys.splice(index - 2, 1);
                        this.recvkeys.splice(index - 2, 1);
                      }
                    }
                  },
                },
              },
            },
          ],
        },
      ];
    },
    dropFiles() {
      return this.$store.state.dropFiles;
    },
    files: {
      get() {
        return this.$store.state.dropFiles.message;
      },
      set(value) {
        const files = Array.from(value);
        files.forEach(file => {
          if (this.addFiles) {
            file.relativePath = file.name;
            this.appendDropFiles(file);
          }
        });
        this.buttonAddingFiles = false;
      },
    },
    keyPagination() {
      return {
        itemCount: this.recvHashedKeys.length,
        itemsPerPage: 5,
        currentPage: this.currentKeyPage,
      };
    },
    addFiles() {
      return this.$store.state.addUploadFiles;
    },
    prevActiveEl() {
      return this.$store.state.prevActiveEl;
    },
    existingFileNames() {
      return this.existingFiles.reduce((array, item) => {
        array.push(item.name);
        return array;
      }, []).join(", ");
    },
  },
  watch: {
    modalVisible: async function() {
      if (this.modalVisible) {
        //inputFolder not cleared when modal toggled,
        //in case there's a delay in upload start
        //reset when modal visible
        this.clearExistingFiles();
        this.objects = [];
        this.filesToOverwrite = [];
        this.recvkeys = [];
        this.inputFolder = "";
        this.containers = await getDB().containers
          .where({ projectID: this.active.id })
          .toArray();
        if (this.currentFolder) {
          const cont = this.containers.find(c =>
            c.name === this.currentFolder);
          this.objects = await getDB().objects
            .where({containerID: cont.id})
            .toArray();
        }
      }
    },
    dropFiles: {
      deep: true,
      handler() {
        if (this.modalVisible) this.getDropTablePage();
      },
    },
    inputFolder: function() {
      if (this.inputFolder && this.interacted) {
        this.checkFolderName();
      }
    },
    active: function () {
      this.projectInfoLink = this.$t("message.supportMenu.projectInfoBaseLink")
        + getProjectNumber(this.active);
    },
    addingFiles() {
      //see if drag&drop adding of files is done:
      if (this.addingFiles) {
        let fileCount = this.dropFiles.length;
        let check = setInterval(() => {
          if (this.dropFiles.length === fileCount) {
            //the amount of dropFiles didn't change
            //in the interval
            this.addingFiles = false;
            clearInterval(check);
          } else {
            fileCount = this.dropFiles.length;
          }
        }, 200);
      }
    },
    abortReason() {
      if (this.abortReason !== undefined) {
        if (this.abortReason
          ?.match("Could not create or access the container.")) {
          this.uploadError = this.currentFolder ?
            this.$t("message.upload.accessFail")
            : this.$t("message.error.createFail")
              .concat(" ", this.$t("message.error.inUseOtherPrj"));
        }
        else if (this.abortReason?.match("cancel")) {
          this.uploadError = this.$t("message.upload.cancelled");
        }
        this.$store.commit("setUploadAbortReason", undefined);
      }
    },
    uploadError() {
      if (this.uploadError) addErrorToastOnMain(this.uploadError);
    },
  },
  updated() {
    if (this.dropFiles.length) {
      //hide itemsPerPageOptions
      const table = document.querySelector("c-data-table.files-table");
      const pagination = table?.shadowRoot.querySelector("c-pagination");
      const menu = pagination?.shadowRoot.querySelector("c-menu");
      menu?.setAttribute("hidden", "true");
    }
  },
  methods: {
    getHumanReadableSize,
    checkPage(event, isKey) {
      const page = checkIfItemIsLastOnPage(
        {
          currentPage: event.target.pagination.currentPage ,
          itemsPerPage: event.target.pagination.itemsPerPage,
          itemCount: event.target.pagination.itemCount,
        });
      if (isKey) {
        this.currentKeyPage = page;
      } else {
        this.filesPagination.currentPage = page;
      }
    },
    appendDropFiles(file, overwrite = false) {
      if (file?.size === 0) {
        this.dropFileErrors[1].show = true;
        setTimeout(() => this.dropFileErrors[1].show = false, 6000);
        return;
      }
      //Check if file path already exists in dropFiles
      if (
        this.dropFiles.find(
          ({ relativePath }) => relativePath === file.relativePath,
        ) === undefined
      ) {
        if (this.objects && !overwrite) {
          //Check if file already exists in container objects
          const existingFile = this.objects.find(obj => obj.name === `${file.relativePath}.c4gh`);
          if (existingFile) {
            this.existingFiles.push(file);
            return;
          }
        }
        this.$store.commit("appendDropFiles", file);
      } else {
        this.dropFileErrors[0].show = true;
        setTimeout(() => this.dropFileErrors[0].show = false, 6000);
      }
    },
    getDropTablePage() {
      const offset =
        this.filesPagination.currentPage
        * this.filesPagination.itemsPerPage
        - this.filesPagination.itemsPerPage;

      const limit = this.filesPagination.itemsPerPage;
      this.paginatedDropFiles = this.dropFiles
        .sort((a, b) => sortItems(
          a, b, this.sortBy, this.sortDirection))
        .slice(offset, offset + limit)
        .map(file => {
          return {
            name: { value: file.name || truncate(100) },
            type: { value: file.type },
            size: { value: getHumanReadableSize(file.size, this.locale) },
            relativePath: {
              value: file.relativePath || truncate(100),
            },
            delete: {
              children: [
                {
                  value: this.$t("message.delete"),
                  component: {
                    tag: "c-button",
                    params: {
                      text: true,
                      size: "small",
                      title: this.$t("message.delete"),
                      path: mdiDelete,
                      onClick: () => {
                        this.deleteDropFile(file);
                      },
                      onKeyUp: (e) => {
                        if(e.keyCode === 13) {
                          this.deleteDropFile(file);
                        }
                      },
                    },
                  },
                },
              ],
            },
          };
        });

      this.filesPagination = {
        ...this.filesPagination,
        itemCount: this.dropFiles.length,
      };
    },
    onSort(event) {
      this.sortBy = event.detail.sortBy;
      this.sortDirection = event.detail.direction;
      this.getDropTablePage();
    },
    deleteDropFile(file) {
      this.$store.commit("eraseDropFile", file);
      const i = this.filesToOverwrite.findIndex(
        (f) => f.relativePath === file.relativePath);
      if (i > -1) {
        this.filesToOverwrite.splice(i, 1);
      }
    },
    overwriteFiles() {
      //if new duplicate files appear after confirmation
      // alert will show again
      for (let i = 0; i < this.existingFiles.length; i++) {
        this.appendDropFiles(this.existingFiles[i], true);
        this.filesToOverwrite.push(this.existingFiles[i]);
      }
      this.clearExistingFiles();
    },
    async deleteSegments() {
      //old file segments need to be deleted because
      //they are not overwritten
      if (!this.filesToOverwrite.length) return;

      let oldSegments = [];
      const segmentCont= await getDB().containers.get({
        projectID: this.active.id,
        name: `${this.currentFolder}_segments`,
      });
      const segmentObjs =  await getObjects(
        this.owner ? this.owner : this.active.id,
        segmentCont.name,
      );

      if (segmentCont) {
        for (let i = 0; i < this.filesToOverwrite.length; i++) {
          const segment = segmentObjs.filter(obj =>
            obj.name.includes(`${this.filesToOverwrite[i].name}.c4gh/`))[0];
          if (segment) oldSegments.push(segment.name);
        }
      }

      if (oldSegments.length) {
        await swiftDeleteObjects(
          this.owner || this.active.id,
          segmentCont.name,
          oldSegments,
        );
      }
    },
    clearExistingFiles() {
      this.existingFiles = [];
    },
    checkFolderName: debounce(function () {
      this.errorMsg = validateFolderName(
        this.inputFolder, this.$t, this.containers);
    }, 300),
    setFile: function (item, path) {
      let entry = undefined;
      if (item.isFile) {
        item.file(file => {
          if (this.addFiles) {
            file.relativePath = path + file.name;
            this.appendDropFiles(file);
          } else return;
        });
      } else if (item instanceof File) {
        this.appendDropFiles(item);
      } else if (item.isDirectory) {
        entry = item;
      }
      if ("function" === typeof item.webkitGetAsEntry) {
        entry = item.webkitGetAsEntry();
      }
      // Recursively process items inside a directory
      if (entry && entry.isDirectory) {
        let newPath = path + entry.name + "/";
        let dirReader = entry.createReader();
        let allEntries = [];

        let readEntries = () => {
          dirReader.readEntries(entries => {
            if (this.addFiles) {
              if (entries.length) {
                allEntries = allEntries.concat(entries);
                return readEntries();
              }
              for (let item of allEntries) {
                if (this.addFiles) {
                  this.setFile(item, newPath);
                }
              }
            } else return; //modal was closed
          });
        };
        readEntries();
      } else if ("function" === typeof item.getAsFile) {
        item = item.getAsFile();
        if (item instanceof File) {
          item.relativePath = path + item.name;
          this.appendDropFiles(item);
        }
      }
    },
    setFiles: function (files) {
      if (files.length > 0) {
        for (let file of files) {
          let entry = file;
          this.setFile(entry, "");
        }
      }
    },
    dragHandler: function (e) {
      e.preventDefault();
      let dt = e.dataTransfer;
      if (dt.types.indexOf("Files") >= 0) {
        const el = document.querySelector(".dropArea");
        el.classList.add("over-dropArea");
        e.stopPropagation();
        dt.dropEffect = "copy";
        dt.effectAllowed = "copy";
      } else {
        dt.dropEffect = "none";
        dt.effectAllowed = "none";
      }
    },
    dragLeaveHandler: function () {
      const el = document.querySelector(".dropArea");
      el.classList.remove("over-dropArea");
    },
    navUpload: function (e) {
      this.addingFiles = true;
      e.stopPropagation();
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.items) {
        this.setFiles(e.dataTransfer.items);
      } else if (e.dataTransfer && e.dataTransfer.files) {
        this.setFiles(e.dataTransfer.files);
      }
      const el = document.querySelector(".dropArea");
      el.classList.remove("over-dropArea");
    },
    validatePubkey(key) {
      const sshed25519 = new RegExp (
        "^ssh-ed25519 AAAAC3NzaC1lZDI1NTE5" +
          "[0-9A-Za-z+/]{46,48}[=]{0,2}\\s[^\\s]+$");
      const crypt4gh = new RegExp (
        "^-----BEGIN CRYPT4GH PUBLIC KEY-----\\s[A-Za-z0-9+/]{42,44}[=]{0,2}" +
          "\\s-----END CRYPT4GH PUBLIC KEY-----$");
      return (key.trim().match(sshed25519) || key.trim().match(crypt4gh));
    },
    appendPublicKey: async function () {
      this.addRecvkey = this.addRecvkey.trim();
      if (!this.recvkeys.includes(this.addRecvkey)){
        this.recvkeys.push(this.addRecvkey);
        this.recvHashedKeys
          .push({key: {value: await computeSHA256(this.addRecvkey)}});
      }
      this.addRecvkey = "";
    },
    cancelUpload() {
      this.$store.commit("setFilesAdded", false);
      this.$store.commit("eraseDropFiles");
      this.toggleUploadModal();
    },
    resetAccordionVal() {
      let accordion = document.getElementById("accordion");
      accordion.value = "advancedOptions";
    },
    toggleUploadModal() {
      this.resetAccordionVal();
      document.querySelector("#uploadModal-toasts").removeToast("upload-toast");
      for (let i = 0; i < this.dropFileErrors.length; i++) {
        this.dropFileErrors[i].show = false;
      }
      this.$store.commit("toggleUploadModal", false);
      this.addingFiles = false;
      this.tags = [];
      this.files = [];
      this.interacted = false;
      this.addRecvkey = "";
      this.recvHashedKeys = [];
      this.errorMsg = "";
      this.toastMsg = "";
      this.sortBy = "name";
      this.sortDirection = "asc";
      this.filesPagination.currentPage = 1;
      this.uploadError = "";

      moveFocusOutOfModal(this.prevActiveEl);
    },
    checkIfCanUpload() {
      if (this.dropFiles.length === 0) {
        return this.$t("message.upload.addFiles");
      }
      else if (!this.pubkey.length && !this.recvkeys.length) {
        return this.$t("message.upload.error");
      }
      else return "";
    },
    onUploadClick() {
      this.toastMsg = this.checkIfCanUpload();

      if (!this.currentFolder) {
        this.inputFolder = this.inputFolder.trim();
        this.errorMsg = validateFolderName(this.inputFolder, this.$t);
      }
      if (this.errorMsg) {
        return;
      }
      else if (this.toastMsg) {
        document.querySelector("#uploadModal-toasts").addToast(
          {
            id: "upload-toast",
            type: "error",
            duration: 4000,
            progress: false,
            message: this.toastMsg,
          },
        );
        return;
      }
      else {
        this.deleteSegments();
        this.beginEncryptedUpload();
      }
    },
    async aBeginEncryptedUpload() {
      // We need the proper IDs for the other project for Vault access
      let owner = "";
      let ownerName = "";
      if (this.pubkey.length > 0 && !(this.$route.params.owner)) {
        this.recvkeys = this.recvkeys.concat(this.pubkey);
      } else if (this.$route.params.owner) {
        let ids = await this.$store.state.client.projectCheckIDs(
          this.$route.params.owner,
        );
        owner = ids.id;
        ownerName = ids.name;
      }

      // Also need to get the other project's key from Vault
      if (this.$route.params.owner) {
        let sharedKey = await signedFetch(
          "GET",
          this.$store.state.uploadEndpoint,
          `/cryptic/${ownerName}/keys`,
        );
        sharedKey = await sharedKey.text();
        sharedKey = `-----BEGIN CRYPT4GH PUBLIC KEY-----\n${sharedKey}\n-----END CRYPT4GH PUBLIC KEY-----\n`;
        this.recvkeys = this.recvkeys.concat([sharedKey]);
      }

      const folderName = this.currentFolder ?
        this.currentFolder :
        this.inputFolder;

      this.$store.commit(
        "setUploadFolder",
        { name: folderName, owner: this.$route.params.owner },
      );
      this.$store.commit("setNewFolder", folderName);

      this.socket.addUpload(
        folderName,
        this.$store.state.dropFiles.map(item => item),
        this.recvkeys.map(item => item),
        owner,
        ownerName,
      );
    },
    beginEncryptedUpload() {
      this.aBeginEncryptedUpload().then(() => {
        delay(() => {
          if (this.$store.state.encryptedFile == ""
            && this.dropFiles.length) {
            //upload didn't start
            this.uploadError = this.$t("message.upload.error");
            this.$store.commit("stopUploading", true);
            this.$store.commit("toggleUploadNotification", false);
          }
        }, 1000);
        this.toggleUploadModal();
      });
    },
    handleKeyDown: function (e) {
      const focusableList = this.$refs.uploadContainer.querySelectorAll(
        "c-link, c-button, textarea, c-text-field, c-data-table",
      );
      const { first, last } = getFocusableElements(focusableList);
      keyboardNavigationInsideModal(e, first, last, true);
    },
  },
};
</script>

<style lang="scss" scoped>

.upload-card {
  padding: 3rem;
  position: absolute;
  top: -1rem;
  left: 0;
  right: 0;
  max-height: 75vh;
}

@media screen and (max-width: 767px), (max-height: 580px) {
   .upload-card {
    top: -5rem;
  }
}

@media screen and (max-height: 580px) and (max-width: 767px),
(max-width: 525px) {
  .upload-card {
    top: -9rem;
  }
}

@media screen and (max-height: 580px) and (max-width: 525px) {
  .upload-card {
    top: -13rem;
  }
}

c-card-content {
  padding: 1rem 0 0 0;
  color: var(--csc-dark);
}

c-card-actions {
  padding: 0;
}

.title.is-6 {
  margin: 0 !important;
}

.dropArea {
  border: 1px dashed $csc-light-grey;
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  & > span:first-of-type {
    margin-right: 1rem;
  }
}

.over-dropArea {
  border: 2px dashed var(--csc-primary);
}

c-data-table.files-table {
  margin-top: -24px;
}

#upload-to-root p {
  padding: 1rem 0 1rem 0;
}

c-data-table.publickey-table {
  margin-top: 1rem;
}

.drop-file-notification {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

c-accordion c-button {
  margin-top: 0.5rem;
}
c-accordion h3 {
  padding: 1rem 0;
}

</style>
