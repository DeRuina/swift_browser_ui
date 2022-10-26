<template>
  <div id="secondary-navbar-wrapper">
    <div
      id="secondary-navbar"
      class="navbar"
    >
      <div class="container is-fluid">
        <div class="navbar-menu">
          <div class="navbar-start">
            <div
              v-if="multipleProjects"
              class="navbar-item"
            >
              <c-select
                v-bind="active"
                c-control
                :items.prop="mappedProjects"
                :label="$t('message.selectProj')"
                placeholder="Select project"
                return-value
                hide-details
                class="select-project"
                data-testid="project-selector"
                @changeValue="changeActive($event)"
              />
            </div>
            <div
              v-if="!multipleProjects"
              class="navbar-item"
            >
              {{ $t("message.currentProj") }}: &nbsp;<span>
                {{ active.name }}
              </span>
            </div>
            <c-button
              ghost
              class="navbar-item"
              data-testid="copy-projectId"
              @click="copyProjectId"
            >
              <i
                slot="icon"
                class="mdi mdi-content-copy"
              />
              {{ $t("message.copy") }} {{ $t("message.share.share_id") }}
            </c-button>
            <c-toasts
              id="copy-toasts"
              vertical="center"
              data-testid="copy-toasts"
            />
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <c-button
                outlined
                data-testid="create-folder"
                @click="toggleCreateFolderModal"
              >
                {{ $t("message.createFolder") }}
              </c-button>
            </div>
            <div class="navbar-item">
              <c-button @click="toggleUploadModal">
                {{ $t("message.uploadSecondaryNav") }}
              </c-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  toggleCreateFolderModal,
  modifyBrowserPageStyles,
} from "@/common/globalFunctions";
export default {
  name: "BrowserSecondaryNavbar",
  props: ["multipleProjects", "projects"],
  data: function () {
    return {
      copy: false,
    };
  },
  computed: {
    active() {
      const activeObject = this.$store.state.active;
      return { ...activeObject, value: activeObject.id };
    },
    uname() {
      return this.$store.state.uname;
    },
    // C-select component handles options by name and value props
    // Append value-prop to projects
    mappedProjects() {
      return this.projects.map(project => ({ ...project, value: project.id }));
    },
  },
  methods: {
    changeActive(event) {
      const item = event.target.value;
      if (item.id !== this.active.id) {
        const navigationParams = {
          name: this.$router.name,
          params: {user: this.uname, project: item.id},
        };

        // Pushing to router before ´go´ method
        // enables navigation with updated item id
        this.$router.push(navigationParams);
        this.$router.go(navigationParams);
      }
    },
    toggleCreateFolderModal: function (folderName) {
      toggleCreateFolderModal(folderName);
      modifyBrowserPageStyles();
    },
    toggleUploadModal: function () {
      this.$store.commit("toggleUploadModal", true);
      modifyBrowserPageStyles();
    },
    copyProjectId: function () {
      const toastMessage = {
        duration: 3000,
        persistent: false,
        progress: false,
      };
      if (!this.copy) {
        navigator.clipboard.writeText(this.active.id).then(() => {
          this.copy = true;
          document.querySelector("#copy-toasts").addToast(
            { ...toastMessage,
              type: "success",
              message: this.$t("message.copied")},
          );
          // avoid multiple clicks of copy button
          // that can stack up the toasts
          // by setting the value for 'copy'
          setTimeout(() => { this.copy = false; }, 3000);
        },() => {
          document.querySelector("#copy-toasts").addToast(
            { ...toastMessage,
              type: "error",
              message: this.$t("message.copy_failed")},
          );
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/css/prod.scss";

#secondary-navbar {
  border-bottom: 6px solid $csc-primary-light;
  min-height: 5rem;
}

.navbar-item:first-of-type {
  padding-left: 0;
}

.select-project {
  padding: 0.5rem 0;
}

c-toasts {
  width: fit-content;
}
</style>