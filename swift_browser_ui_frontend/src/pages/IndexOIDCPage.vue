<template>
  <c-main>
    <MainToolbar />
    <CookieConsentModal />
    <c-row>
      <c-flex>
        <c-container class="padding">
          <form>
            <c-login-card
              :src="bannerUrl"
            >
              <c-alert
                v-if="!idb"
                type="error"
              >
                <p>{{ $t('message.error.idb_text') }}</p>
              </c-alert>
              <c-login-card-title>
                {{ $t('message.program_name') }}
              </c-login-card-title>
              <c-login-card-content>
                <p>{{ $t('message.program_description') }}</p>
              </c-login-card-content>
              <c-login-card-actions>
                <c-button
                  size="large"
                  :loading="loading"
                  :disabled="!idb"
                  @click="loginButtonClick"
                  @keyup.enter="loginButtonClick"
                >
                  {{ $t('message.indexOIDC.logIn') }}
                </c-button>
              </c-login-card-actions>
            </c-login-card>
          </form>
        </c-container>
      </c-flex>
    </c-row>
    <CFooter />
  </c-main>
</template>

<script>

export default {
  methods: {
    loginButtonClick: function() {
      this.loading = true;
      window.location.pathname = this.$t("message.indexOIDC.href");
    },
  },
};
</script>

<style>

c-main {
  height: unset;
  min-height: 100vh;
  justify-content: space-between;
}
c-login-card {
  margin: 2rem auto;
  max-width: 55rem;
  height: 35rem;
}
c-button {
  margin-top: 2rem;
}

</style>
