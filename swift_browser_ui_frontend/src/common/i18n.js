import { createI18n } from "vue-i18n";

import getLangCookie from "@/common/conv";
import translations from "@/common/lang";
import { applyBucketOverrides, removeBucketOverrides,
  overridesApplied} from "@/common/lang";


export const i18n = createI18n({
  locale: getLangCookie(),
  messages: translations,
  warnHtmlMessage: false,
});


// Function to toggle language overrides
export function toggleBucketOverrides() {
  if (!overridesApplied) {
    applyBucketOverrides();
  } else {
    removeBucketOverrides();
  }
}
