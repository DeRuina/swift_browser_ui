## Allas-UI Changes


### Description

The changes explained below were made in order to remove the encryption in the upload process and decryption in the download process, as well as the cryptographic headers as all are unnecessary for the Allas UI interface. Any other changes made are also detailed.

[swift-browser-ui](https://github.com/CSCfi/swift-browser-ui) is the base repository and all the changes made for the Allas-UI are as follows:


### Upload (Encryption)

#### WebAssembly

The file `$REPO/swift_browser_ui_frontend/wasm/src/streamingupload.c` which included the functions `create_session_key()` `create_crypt4gh_header()` `encrypt_chunk()` was deleted. The associated `$REPO/swift_browser_ui_frontend/wasm/src/include/streamingupload.h` `$REPO/swift_browser_ui_frontend/wasm/test/test_streamingupload.c` were deleted as well.


In the file `$REPO/swift_browser_ui_frontend/wasm/src/streamingdownload.c` the function `decrypt_chunk()` was deleted. The associated headers and tests included.

In the file `$REPO/swift_browser_ui_frontend/wasm/src/upcommon.c` the functions `get_keypair_private_key()` `crypt4gh_session_key_new()` `free_crypt4gh_session_key()` `allocate_chunk()` `free_chunk_nobuf()` were deleted. The associated headers and tests included.