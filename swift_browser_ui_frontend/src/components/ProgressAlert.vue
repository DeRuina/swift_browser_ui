<template>
  <c-alert
    :id="type + '-alert'"
    type="success"
  >
    <c-row
      gap="64"
      justify="space-between"
      align="center"
    >
      <h3>
        <i
          slot="icon"
          :class="
            type === 'upload'
              ? 'mdi mdi-tray-arrow-up'
              : 'mdi mdi-tray-arrow-down'
          "
        />
        {{
          finished
            ? type === "upload"
              ? $t("message.upload.complete")
              : $t("message.download.complete")
            : type === "upload"
              ? $t("message.upload.inProgress")
              : isProgressing
                ? $t("message.download.inProgress")
                : $t("message.download.gathering")
        }}
      </h3>

      <ProgressBar
        :type="type"
        :finished="finished"
      />

      <a
        v-if="type === 'upload'"
        href="javascript:void(0)"
        class="link-underline"
        @click="$emit('view-container')"
      >
        {{ $t("message.upload.viewDestinationFolder") }}
      </a>

      <div class="actions">
        <c-icon-button
          size="small"
          text
          @click="$emit('toggleSize')"
          @keyup.enter="$emit('toggleSize')"
        >
          <c-icon :path="mdiArrowExpand" />
        </c-icon-button>

        <c-icon-button
          v-if="finished"
          size="small"
          text
          @click="$emit('close')"
          @keyup.enter="$emit('close')"
        >
          <c-icon :path="mdiClose" />
        </c-icon-button>
      </div>
    </c-row>
  </c-alert>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";
import { mdiClose, mdiArrowExpand } from "@mdi/js";

export default {
  name: "ProgressAlert",
  components: {
    ProgressBar,
  },
  props: ["type", "finished"],
  emits: ["view-container", "close", "toggleSize"],
  data() {
    return {
      mdiClose,
      mdiArrowExpand,
    };
  },
  computed: {
    isProgressing() {
      return this.$store.state.downloadProgress !== undefined;
    },
  },
};
</script>

<style scoped lang="scss">
c-alert {
  margin: 1rem 5%;
}

h3 {
  font-size: 18px;
  i {
    margin-right: 0.5rem;
  }
}
.actions {
  display: inherit;
  flex-direction: inherit;
  gap: 1rem;
}

@media screen and (max-width: 840px) {
  .link-underline {
    display: none;
  }
}
</style>
