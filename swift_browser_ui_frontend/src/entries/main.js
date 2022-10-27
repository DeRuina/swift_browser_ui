// Project main imports
import Vue from "vue";
import App from "@/pages/BrowserPage.vue";
import Buefy from "buefy";
import router from "@/common/router";
import VueI18n from "vue-i18n";

// Project Vue components
import BrowserMainNavbar from "@/components/BrowserMainNavbar.vue";
import BrowserSecondaryNavbar from "@/components/BrowserSecondaryNavbar.vue";
import CreateFolderModal from "@/components/CreateFolderModal";
import UploadModal from "@/components/UploadModal";
import EditTagsModal from "@/components/EditTagsModal";
import ShareModal from "@/components/ShareModal";
import CopyFolderModal from "@/components/CopyFolderModal";

// CSC UI things
import cModel from "@/common/csc-ui.js";

import { applyPolyfills, defineCustomElements } from "csc-ui/dist/loader";
import { vControlV2 } from "csc-ui-vue-directive";

// Project JS functions
import getLangCookie from "@/common/conv";
import translations from "@/common/lang";
import { getUser } from "@/common/api";
import { getProjects } from "@/common/api";

// Import SharingView and Request API
import SwiftXAccountSharing from "@/common/swift_x_account_sharing_bind";
import SwiftSharingRequest from "@/common/swift_sharing_request_bind";

// Import container ACL sync
import { syncContainerACLs, DEV } from "@/common/conv";
import checkIDB from "@/common/idb_support";

// Import project state
import store from "@/common/store";

// Import project css
import "@/css/prod.scss";

// Import resumable
import Resumable from "resumablejs";

// Upload notification handler
import UploadNotification from "@/components/UploadNotification";

// Import delay
import delay from "lodash/delay";

checkIDB().then(result => {
  if (!result) {
    window.location.pathname = "/";
  }
});

if ("serviceWorker" in navigator) {
  let workerUrl = new URL(
    "/libupload.js",
    document.location.origin,
  );
  let ping = (navigator.serviceWorker.controller == null);
  navigator.serviceWorker.register(workerUrl).then(reg => {
    reg.update();
    if (ping) {
      console.log("Pinging first serviceWorker.");
      navigator.serviceWorker.ready.then(reg => {
        reg.active.postMessage({
          cmd: "pingWasm",
        });
      });
    }
  }).catch((err) => {
    console.log("Failed to register service worker.");
    console.log(err);
  });
} else {
  if(DEV) console.log("Did not register Service Worker.");
}

window.onerror = function(error) { 
  if(DEV) console.log("Global error", error);
};
window.addEventListener("unhandledrejection", function (event) {
  if (DEV) console.log("unhandledrejection", event);
  event.preventDefault();
  event.stopPropagation();
});
window.addEventListener("rejectionhandled", function (event) {
  if (DEV) console.log("rejectionhandled", event);
  event.preventDefault();
  event.stopPropagation();
});

Vue.config.productionTip = false;
Vue.config.errorHandler = function (err, vm, info) {
  if (DEV) console.log("Vue error: ", err, vm, info);
};
Vue.config.warnHandler = function (msg, vm, info) {
  if (DEV) console.log("Vue warning: ", msg, vm, info);
};

Vue.use(Buefy);
Vue.use(VueI18n);

// Configure csc-ui
Vue.config.ignoredElements = [/c-\w*/];
applyPolyfills().then(() => {
  defineCustomElements();
});

Vue.directive("control", vControlV2);
Vue.directive("csc-model", cModel);

const i18n = new VueI18n({
  locale: getLangCookie(),
  messages: translations,
});

new Vue({
  i18n,
  router,
  store,
  components: {
    BrowserMainNavbar,
    BrowserSecondaryNavbar,
    CreateFolderModal,
    UploadModal,
    UploadNotification,
    EditTagsModal,
    ShareModal,
    CopyFolderModal,
  },
  data: function () {
    return {
      files: [],
    };
  },
  computed: {
    projects() {
      return this.$store.state.projects;
    },
    currentUpload() {
      return this.$store.state.currentUpload;
    },
    multipleProjects() {
      return this.$store.state.multipleProjects;
    },
    langs() {
      return this.$store.state.langs;
    },
    active() {
      return this.$store.state.active;
    },
    user() {
      return this.$store.state.uname;
    },
    isFullPage() {
      return this.$store.state.isFullPage;
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
    isChunking() {
      return this.$store.state.isChunking;
    },
    isUploading() {
      return this.$store.state.isUploading;
    },
    displayUploadNotification () {
      return this.$store.state.uploadNotification;
    },
    resumableClient () {
      return this.$store.state.resumableClient;
    },
    altContainer() {
      return this.$store.state.altContainer;
    },
    uploadInfo() {
      return this.$store.state.uploadInfo;
    },
    prefix() {
      return this.$store.state.currentPrefix;
    },
    openCreateFolderModal: {
      get() {
        return this.$store.state.openCreateFolderModal;
      },
      set(newState) {
        return newState;
      },
    },
    openUploadModal: {
      get() {
        return this.$store.state.openUploadModal;
      },
      set(newState) {
        return newState;
      },
    },
    openEditTagsModal: {
      get() {
        return this.$store.state.openEditTagsModal;
      },
      set(newState) {
        return newState;
      },
    },
    openCopyFolderModal: {
      get() {
        return this.$store.state.openCopyFolderModal;
      },
      set(newState) {
        return newState;
      },
    },
    openShareModal: {
      get() {
        return this.$store.state.openShareModal;
      },
      set() {},
    },
  },
  created() {
    document.title = this.$t("message.program_name");

    navigator.serviceWorker.addEventListener("message", e => {
      if (e.data.eventType == "wasmReady") {
        this.$buefy.snackbar.open({
          message:
            "Encryption engine is ready. Hit refresh to refresh the " +
            "window to enable encryption.",
          type: "is-success",
          position: "is-top",
          actionText: "Refresh",
          indefinite: true,
          onAction: () => {
            location.reload();
          },
        });
      }
    });

    this.createUploadInstance();
    let initialize = async () => {
      let active;
      let user = await getUser();
      let projects = await getProjects();
      this.$store.commit("setUname", user);
      this.$store.commit("setProjects", projects);

      const existingProjects = await this.$store.state.db.projects
        .toCollection()
        .primaryKeys();
      await this.$store.state.db.projects.bulkPut(projects);
      const toDelete = [];
      existingProjects.map(async oldProj => {
        if (!projects.find(proj => proj.id === oldProj)) {
          toDelete.push(oldProj);
        }
      });
      if (toDelete.length) {
        await this.$store.state.db.projects.bulkDelete(toDelete);
        const containersCollection = this.$store.state.db.containers
          .where("projectID")
          .anyOf(toDelete);
        const containers = await containersCollection.primaryKeys();
        await containersCollection.delete();
        await this.$store.state.db.objects
          .where("containerID")
          .anyOf(containers)
          .delete();
      }

      let last_active;
      if (document.cookie.match("LAST_ACTIVE")) {
        last_active = document.cookie
          .split("; ")
          .find(row => row.startsWith("LAST_ACTIVE"))
          .split("=")[1];
      }
      if (last_active) {
        active =
          projects[projects.indexOf(projects.find(e => e.id == last_active))];
      } else if (!(this.$route.params.user === undefined)) {
        if (!(this.$route.params.project === undefined)) {
          active =
            projects[
              projects.indexOf(
                projects.find(e => e.id == this.$route.params.project),
              )
            ];
        }
      } else {
        active = projects[0];
      }
      this.$store.commit("setActive", active);

      if (document.location.pathname == "/browse") {
        this.$router.push({
          name: "AllFolders",
          params: {
            project: active.id,
            user: user,
          },
        });
      }
      return active;
    };
    initialize().then(ret => {
      if (this.$te("message.keys")) {
        for (let item of Object.entries(this.$t("message.keys"))) {
          let keyURL = new URL(
            "/download/" +
              item[1]["project"] +
              "/" +
              item[1]["container"] +
              "/" +
              item[1]["object"],
            document.location.origin,
          );
          keyURL.searchParams.append("project", ret.id);
          fetch(keyURL)
            .then(resp => {
              return resp.text();
            })
            .then(resp => {
              this.$store.commit("appendPubKey", resp);
            });
        }
      }
    });
    fetch("/discover")
      .then(resp => {
        return resp.json();
      })
      .then(ret => {
        if (ret.sharing_endpoint) {
          this.$store.commit(
            "setSharingClient",
            new SwiftXAccountSharing(
              ret.sharing_endpoint,
              document.location.origin,
            ),
          );
        }
        if (ret.request_endpoint) {
          this.$store.commit(
            "setRequestClient",
            new SwiftSharingRequest(
              ret.request_endpoint,
              document.location.origin,
            ),
          );
        }
      });
    delay(this.containerSyncWrapper, 10000);
  },
  mounted() {
    document.getElementById("mainContainer")
      .addEventListener("uploadComplete", () => {
        this.$buefy.toast.open({
          message: this.$t("message.upload.complete"),
          type: "is-success",
        });
      });
  },
  methods: {
    containerSyncWrapper: function () {
      syncContainerACLs(this.$store.state.client, this.$store.state.active.id);
    },
    // Following are the methods used for resumablejs, as the methods
    // need to have access to the vue instance.
    addFile: function () {
      if(!this.isUploading) {
        this.resumableClient.upload();
      }
    },
    fileSuccessToast: function (file) {
      this.removeUploadToast();

      document.querySelector("#toasts").addToast({
        id: "file-success",
        type: "success",
        progress: false,
        horizontal: "center",
        message: this.$t("message.upload.upfinish").concat(file.fileName),
      });

      if (this.$route.params.container != undefined) {
        this.$store.dispatch("updateObjects", { route: this.$route });
      }
    },
    fileFailureToast: function (file) {
      this.removeUploadToast();

      document.querySelector("#toasts").addToast({
        id: "file-failure",
        type: "error",
        progress: false,
        horizontal: "center",
        message: this.$t("message.upload.upfail").concat(file.fileName),
      });
    },
    removeUploadToast () {
      const uploadToast = document.querySelector("#upload-toast");
      if (uploadToast) {
        document.querySelector("#upload-toast").removeToast("upload-toast");
      }
      
      this.$store.commit("toggleUploadNotification", false);
    },
    getUploadUrl: function (params) {
      // Bake upload runner information to the resumable url parameters.
      let retUrl = new URL(this.uploadInfo.url);

      for (const param of params) {
        let newParam = param.split("=");
        // check if we should move the file under a pseudofolder
        // using the current prefix defined in state for the url
        if (
          newParam[0].match("resumableRelativePath") &&
          this.prefix != undefined
        ) {
          retUrl.searchParams.append(newParam[0], this.prefix + newParam[1]);
        } else {
          retUrl.searchParams.append(newParam[0], newParam[1]);
        }
      }
      retUrl.searchParams.append("session", this.uploadInfo.id);
      retUrl.searchParams.append("valid", this.uploadInfo.signature.valid);
      retUrl.searchParams.append(
        "signature",
        this.uploadInfo.signature.signature,
      );
      return retUrl;
    },
    startUpload: function () {
      this.$store.commit("setUploading");
      window.onbeforeunload = function () {
        return "";
      };
    },
    endUpload: function () {
      this.$store.commit("eraseAltContainer");
      this.$store.commit("stopUploading");
      this.$store.commit("eraseUploadInfo");
      this.$store.dispatch("updateContainers");
      window.onbeforeunload = undefined;
    },
    startChunking: function () {
      this.$store.commit("setChunking");
    },
    stopChunking: function () {
      this.$store.commit("stopChunking");
    },
    onComplete: function () {
      this.endUpload();
      this.stopChunking();
      this.createUploadInstance(); // Allows new uploads
      this.$store.commit("eraseProgress");
    },
    onCancel: function () {
      document.querySelector("#toasts").addToast({
        id: "upload-cancel",
        type: "info",
        progress: false,
        horizontal: "center",
        message: this.$t("message.upload.cancelled"),
      });

      this.onComplete();
    },
    updateProgress() {
      this.$store.commit("updateProgress", this.resumableClient.progress());
    },
    createUploadInstance: function () {
      let res = new Resumable({
        target: this.getUploadUrl,
        testTarget: this.getUploadUrl,
        chunkSize: 10485760,
        forceChunkSize: true,
        simultaneousUploads: 1,
      });

      if (!res.support) {
        this.$buefy.toast.open({
          message: this.$("message.upload.upnotsupported"),
          type: "is-danger",
        });
        return;
      }

      // Set handlers
      res.on("uploadStart", this.startUpload);
      res.on("complete", this.onComplete);
      res.on("cancel", this.onCancel);
      res.on("filesAdded", this.addFile);
      res.on("fileSuccess", this.fileSuccessToast);
      res.on("fileError", this.fileFailureToast);
      res.on("chunkingStart", this.startChunking);
      res.on("chunkingComplete", this.stopChunking);
      res.on("progress", this.updateProgress);

      this.$store.commit("setResumable", res);
    },
    getRouteAsList: function () {
      // Create a list representation of the current application route
      // to be used in the initialization of the breadcrumb component
      let retl = [];

      retl.push({
        alias: this.$store.state.uname,
        address: { name: "DashboardView" },
      });

      if (this.$route.params.project != undefined) {
        if (this.$route.path.match("sharing") != null) {
          retl.push({
            alias: this.$t("message.sharing") + this.$store.state.active.name,
            address: { name: "SharedTo" },
          });
        } else {
          retl.push({
            alias:
              this.$t("message.containers") + this.$store.state.active.name ||
              "",
            address: { name: "AllFolders" },
          });
        }
      }

      if (this.$route.params.container != undefined) {
        retl.push({
          alias: this.$route.params.container,
          address: { name: "ObjectsView" },
        });
      }

      return retl;
    },  
  },
  ...App,
}).$mount("#app");
