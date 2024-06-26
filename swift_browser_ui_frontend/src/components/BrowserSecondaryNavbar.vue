<template>
  <div id="secondary-navbar">
    <div class="container-fluid">
      <div
        v-if="multipleProjects"
        class="nav-item select-project"
      >
        <c-select
          :key="routeToParams ? routeToParams?.project : active.id"
          v-csc-control
          v-bind="active"
          :items.prop="mappedProjects"
          :label="$t('message.selectProj')"
          placeholder="Select project"
          return-value
          hide-details
          data-testid="project-selector"
          @changeValue="changeActive($event)"
        />
      </div>
      <div
        v-if="!multipleProjects"
        class="nav-item column"
      >
        <p class="label">
          {{ $t("message.currentProj") }}
        </p>
        <p class="project-number">
          {{ active.name }}
        </p>
      </div>
      <div class="nav-item">
        <c-button
          ghost
          data-testid="copy-projectId"
          :aria-label="$t('label.copyshareid')"
          @click="copyProjectId"
          @keyup.enter="copyProjectId"
        >
          <i
            slot="icon"
            class="mdi mdi-content-copy"
          />
          {{ $t("message.share.share_id_copy") }}
        </c-button>
        <div
          class="tooltip"
          role="tooltip"
          :aria-label="$t('label.shareid_tooltip')"
        >
          <c-icon
            :path="mdiInformationOutline"
            tabindex="0"
          />
          <span
            id="shareid-tooltip-content"
            class="tooltip-content"
            role="tooltip"
          >
            <i18n-t
              keypath="message.share.share_id_tooltip"
              scope="global"
            >
              <template #tooltipb>
                <b>
                  {{ $t("message.share.share_id_tooltipb") }}
                </b>
              </template>
            </i18n-t>
          </span>
        </div>
      </div>
      <c-toasts
        id="copy-toasts"
        vertical="center"
        data-testid="copy-toasts"
      />
      <c-toasts
        id="decryption-toasts"
        vertical="center"
        data-testid="decryption-toasts"
      />
      <c-spacer />
      <div class="nav-item">
        <c-button
          :disabled="isUploading || !canUpload"
          data-testid="upload-file"
          @click="toggleUploadModal(false)"
          @keyup.enter="toggleUploadModal(true)"
        >
          <c-icon :path="mdiTrayArrowUp" />
          {{ $t("message.uploadSecondaryNav") }}
        </c-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addErrorToastOnMain,
  getAccessDetails,
} from "@/common/globalFunctions";
import { setPrevActiveElement } from "@/common/keyboardNavigation";
import {
  mdiInformationOutline,
  mdiTrayArrowUp,
} from "@mdi/js";

export default {
  name: "BrowserSecondaryNavbar",
  props: ["multipleProjects", "projects"],
  data: function () {
    return {
      mdiInformationOutline,
      mdiTrayArrowUp,
      copy: false,
      canUpload: false,
    };
  },
  computed: {
    active() {
      const activeObject = this.$store.state.active;
      return { ...activeObject, value: activeObject.id };
    },
    routeToParams() {
      return this.$store.state.routeTo.params;
    },
    uname() {
      return this.$store.state.uname;
    },
    // C-select component handles options by name and value props
    // Append value-prop to projects
    mappedProjects() {
      return this.projects.map(project => ({ ...project, value: project.id }));
    },
    isUploading() {
      return this.$store.state.isUploading;
    },
    owner() {
      return this.$route.params.owner;
    },
    container() {
      return this.$route.params.container;
    },
    client() {
      return this.$store.state.client;
    },
    downloadAbortReason() {
      return this.$store.state.downloadAbortReason;
    },
    downloadCount() {
      return this.$store.state.downloadCount;
    },
  },
  watch: {
    container() {
      this.checkIfCanReadWrite();
    },
    client() {
      this.checkIfCanReadWrite();
    },
    downloadAbortReason() {
      if (this.downloadAbortReason) {
        addErrorToastOnMain(this.$t(`message.download.${this.downloadAbortReason}`));
        this.$store.commit("setDownloadAbortReason", undefined);
      }
    },
  },
  methods: {
    changeActive(event) {
      const itemId = event.target.value;
      const navigationParams = {
        name: "AllFolders",
        params: {user: this.uname, project: itemId},
      };

      if (itemId !== this.active.id) {
        if (!this.isUploading && this.downloadCount < 1) {
          // Updates URL, and then refreshes the page
          this.$router.push(navigationParams).then(() => {
            this.$router.go(0);
          });
        }
        else {
          //ask user confirmation to interrupt upload / download
          this.$store.commit("setRouteTo", navigationParams);
          this.$store.commit("toggleConfirmRouteModal", true);
        }
      }
    },
    toggleUploadModal: function (keypress) {
      this.$store.commit("setFilesAdded", true);
      this.$store.commit("toggleUploadModal", true);
      if (keypress) setPrevActiveElement();
      if (!this.container) {
        setTimeout(() => {
          const uploadFolderInput = document
            .querySelector("#upload-folder-input input");
          uploadFolderInput.focus();
        }, 300);
      }
    },
    checkIfCanReadWrite: async function () {
      //disable upload if user doesn't have rw perms
      //in shared folder
      if (!this.owner) this.canUpload = true;
      else {
        const share = await getAccessDetails(
          this.active.id,
          this.container,
          this.owner,
        );
        if (!share.access) this.canUpload = false;
        else this.canUpload = share.access.length === 2;
      }
    },
    copyProjectId: function () {
      const toastMessage = {
        duration: 6000,
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
          setTimeout(() => { this.copy = false; }, 6000);
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

#secondary-navbar {
  border-bottom: 6px solid $csc-primary-light;
}

.container-fluid {
  display: flex;
  padding: 0.5rem 1rem !important;
  flex-wrap: wrap;
}

#secondary-navbar .nav-item {
  height: 100%;
  align-self: center;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 0.5rem 0.75rem;
  position: relative;
}

c-toasts {
  width: fit-content;
}

.select-project, .column {
  min-width: 15rem;
  flex: 0.5;
}

c-select {
  flex: 1;
}

@media screen and (max-width: 767px) {
  .select-project, .column {
    width: 100%;
    flex: auto;
  }
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip c-icon {
  margin-left: 0.5rem;
  color: $csc-primary;
}

.tooltip-content {
  visibility: hidden;
  text-align: left;
  width: 20rem;
  background-color: $white;
  color: $text;
  border: 1px solid $csc-primary;
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 14px;
  line-height: 16px;

  /* Position the tooltip */
  position: absolute;
  z-index: 5;
  top: 150%;
  left: 50%;
  margin-left: -10rem;
}

.tooltip:hover .tooltip-content, .tooltip:focus-within .tooltip-content {
  visibility: visible;
}

.tooltip-content::before {
  content: " ";
  position: absolute;
  left: 48%;
  bottom: 100%;
  width: 0;
  height: 0;
  border: 0.7rem solid transparent;
  border-bottom-color: $csc-primary;
}
.tooltip-content::after {
  content: " ";
  position: absolute;
  left: 52%;
  bottom: 100%;
  width: 0;
  height: 0;
  margin-left: -0.75rem;
  border: 0.65rem solid transparent;
  border-bottom-color: $white;
}

.column {
  flex-direction: column;
  padding: 0 0 0 1.5rem;
  color: var(--csc-dark);
}

.project-number {
  font-size: 0.875rem;
}

.label {
  font-weight: 400;
  font-size: 0.75rem;
}
</style>
