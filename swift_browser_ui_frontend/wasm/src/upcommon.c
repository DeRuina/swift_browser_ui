/*
Common upload and download related functions
*/

#define _XOPEN_SOURCE 500
#include <stdint.h>
#include <errno.h>

#ifdef TEST
#include "stub_crypt4gh.h"
#include "stub_sodium.h"
#include <stdlib.h>
#include "stub_unistd.h"
#else
#include <crypt4gh.h>
#include <sodium.h>
#include <unistd.h>
#endif // TEST

#include "include/upcommon.h"
#include "include/upinit.h"
#include "include/uptypes.h"

/*
Generate download keypair
*/
KEYPAIR *create_keypair()
{
    KEYPAIR *ret = malloc(sizeof(KEYPAIR));

    crypto_kx_keypair(
        ret->public,
        ret->private);

    return ret;
}

/*
Free a keypair
*/
void free_keypair(KEYPAIR *kp)
{
    free(kp);
    return;
}

/*
Get crypt4gh public key
*/
uint8_t *get_keypair_public_key(KEYPAIR *kp)
{
    return kp->public;
}

/*
wrap filesystem item remove
*/
int nftwremove(
    const char *path,
    const struct stat *st,
    int flag,
    struct FTW *ftws)
{
    if (flag == FTW_F)
    {
        return unlink(path);
    }
    return 0;
}

/*
Wipe the temporary receiver keys used for building the receiver list.
*/
int rmrecv(const char *keypath)
{
    int ret;
    ret = nftw(
        keypath,
        &nftwremove,
        5, // use at most 5 file descriptors
        0);

    return ret;
}

/*
Wrap chunk length from pointer
*/
int wrap_chunk_len(CHUNK *chunk)
{
    return chunk->len;
}

/*
Wrap chunk content ptr get
*/
uint8_t *wrap_chunk_content(CHUNK *chunk)
{
    return chunk->chunk;
}

/*
Free chunk contents.
*/
void free_chunk(CHUNK *chunk)
{
    if (chunk->chunk)
    {
        free(chunk->chunk);
    }
    free(chunk);
    return;
}

