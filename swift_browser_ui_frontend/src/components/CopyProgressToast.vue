<template>
  <!-- show ONLY the newest job (single card) -->
  <div v-if="job" class="copy-toast-stack" aria-live="polite">
    <div class="copy-toast-card">
      <div class="copy-toast-top">
        <div class="copy-toast-title">
          <div class="title is-6">{{ jobTitle(job) }}</div>

          <div class="copy-toast-sub">
            <template v-if="job.state === 'running'">
              {{ $t?.("message.copyinprogress") }}
            </template>
            <template v-else-if="job.state === 'finished'">
              {{ $t?.("message.copysuccess") }}
            </template>
            <template v-else-if="job.state === 'cancelled'">
              {{ $t?.("message.copycancel") }}
            </template>
            <template v-else-if="job.state === 'failed'">
              {{ $t?.("message.copyfail") }}
              <span v-if="job.error" class="copy-toast-error"> — {{ job.error }}</span>
            </template>
          </div>
        </div>

        <span class="copy-toast-pill" :data-state="job.state">
          {{ job.state }}
        </span>
      </div>

    <div class="copy-toast-progress">
    <c-progress-bar
        v-if="job.total > 0"
        :value="percent(job)"
        single-line
        :label="$t?.('message.upload.progressLabel')"
    />
    <c-progress-bar
        v-else
        single-line
        indeterminate
    />

    <div v-if="job.total > 0" class="copy-toast-progress-meta">
        <span>{{ job.done }} / {{ job.total }}</span>
    </div>
    </div>



      <p v-if="job.state === 'running'" class="copy-toast-help">
        {{ $t?.("message.copyhelp") }}
      </p>

      <p v-if="job.state === 'running'" class="copy-toast-warn">
       {{ $t?.("message.copycancelwarn") }}
      </p>


      <div class="copy-toast-actions">
      <c-button
       v-if="job.state === 'running'"
       outlined
       size="small"
       @click="cancel(job.jobId)"
      >
      {{ $t("message.cancel") }}
      </c-button>


        <c-button
          v-else
          size="small"
          outlined
          @click="dismiss(job.jobId)"
        >
          {{ $t?.("message.close") }}
        </c-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CopyProgressToast",
  computed: {
    jobs() {
      const jobs = Object.values(this.$store.state.copyJobs || {});
      return jobs.sort((a, b) => String(b.jobId).localeCompare(String(a.jobId)));
    },
    job() {
      return this.jobs.length ? this.jobs[0] : null;
    },
  },
  methods: {
    jobTitle(job) {
      return job.label || `Copy job ${job.jobId}`;
    },
    percent(job) {
      if (!job.total) return 0;
      return Math.min(100, Math.floor((job.done / job.total) * 100));
    },
    async cancel(jobId) {
      await this.$store.dispatch("cancelCopyJob", { jobId });
    },
    dismiss(jobId) {
      this.$store.dispatch("dismissCopyJob", { jobId });
    },
  },
};
</script>

<style scoped>
.copy-toast-stack {
  position: fixed;
  left: 50%;
  bottom: 3rem;
  transform: translateX(-50%);
  z-index: 2000;
  width: min(640px, calc(100vw - 2rem));
}

.copy-toast-card {
  background: var(--csc-white, #fff);
  color: var(--csc-dark, #222);
  border-radius: 6px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.18);

  padding: 1.25rem 1.25rem 1rem 1.25rem;
  border: 2px solid #5bb318;
  border-left: 10px solid #5bb318;
  overflow: hidden;
}

.copy-toast-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.copy-toast-sub {
  margin-top: 0.25rem;
  opacity: 0.9;
  font-size: 14px;
}

.copy-toast-pill {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--csc-light-grey, #eee);
  text-transform: capitalize;
  white-space: nowrap;
  margin-top: 2px;
}

.copy-toast-progress {
  margin-top: 0.75rem;
}

.copy-progress {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  appearance: none;
}

.copy-progress::-webkit-progress-bar {
  background: #e6e6e6;
  border-radius: 999px;
}

.copy-progress::-webkit-progress-value {
  background: #2f6fed;
  border-radius: 999px;
}

.copy-progress::-moz-progress-bar {
  background: #2f6fed;
  border-radius: 999px;
}

.copy-toast-progress-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.85;
  margin-top: 0.35rem;
}

.copy-toast-help {
  margin-top: 0.75rem;
  font-size: 14px;
  opacity: 0.9;
}

.copy-toast-warn {
  margin-top: 0.75rem;
  font-size: 14px;
  opacity: 0.9;
}

.copy-toast-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
}

.copy-toast-error {
  opacity: 0.85;
}
</style>
