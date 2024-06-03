/*
Download service worker handlers.
*/

#include <stdint.h>
#include <errno.h>
#include <string.h>

#ifdef TEST
#include "stub_crypt4gh_header.h"
#include "stub_crypt4gh_segment.h"
#include "stub_crypt4gh.h"
#include "stub_sodium.h"
#include "stub_unistd.h"
#include "stub_fcntl.h"
#include <stdlib.h>
#else
#include <crypt4gh/header.h>
#include <crypt4gh/segment.h>
#include <crypt4gh.h>
#include <fcntl.h>
#include <unistd.h>
#include <sodium.h>
#endif //TEST


#include "include/uptypes.h"
#include "include/upinit.h"
#include "include/upcommon.h"

#include "include/streamingdownload.h"

uint8_t chunk_buf[65536];
// Reserve the chunk buffer
CHUNK ret_buf;

/*
Open crypt4gh header for file decryption.
*/
uint8_t *get_session_key_from_header(const KEYPAIR *kp, const char *header)
{
    uint8_t *sessionkey;

    int ret = 0;
    int fd = open(header, O_RDONLY);

    uint8_t *keys = NULL;
    size_t nkeys = 0;
    uint8_t *edit_list = NULL;
    size_t edit_list_len = 0;

    ret = crypt4gh_header_parse(
        fd,
        kp->private,
        kp->public,
        &keys,
        &nkeys,
        &edit_list,
        &edit_list_len);

    if (edit_list != NULL && edit_list_len > 0)
    {
        sodium_free(edit_list);
    }

    if (keys != NULL && nkeys > 0)
    {
        return keys;
    }
    else
    {
        return NULL;
    }
}

