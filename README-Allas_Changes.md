## Allas-UI Changes


### Description

The changes explained below were made in order to remove the encryption in the upload process and decryption in the download process, as well as the cryptographic headers as all are unnecessary for the Allas UI interface. Any other changes made are also detailed.

[swift-browser-ui](https://github.com/CSCfi/swift-browser-ui) is the base repository and all the changes made for the Allas-UI are as follows:


### WebAssembly (C)

1. The folder `$REPO/swift_browser_ui_frontend/wasm/src` that included all the `c` files and the header files was removed. The folder `$REPO/swift_browser_ui_frontend/wasm/test` that included all the tests for those `c` functions was removed as well.

2. `Makefile` Modification: This is the modified `makefile`
   ```Makefile
   all: upload download

   upload: build/upworker.js build/upworker.wasm

   download: build/downworker.js build/downworker.wasm

   build/upworker.js:
      emcc -O3 \
         -s WASM=1 \
         -s TOTAL_MEMORY=268435456 \
         -s ALLOW_MEMORY_GROWTH=1 \
         -s ASSERTIONS=1 \
         -s LLD_REPORT_UNDEFINED \
         -s FORCE_FILESYSTEM=1 \
         -o $@ \
         --post-js build/upworker-post.js \
         --pre-js js/crypt-pre.js

   build/downworker.js:
      emcc -O3 \
         -s WASM=1 \
         -s TOTAL_MEMORY=268435456 \
         -s ALLOW_MEMORY_GROWTH=1 \
         -s ASSERTIONS=1 \
         -s LLD_REPORT_UNDEFINED \
         -s FORCE_FILESYSTEM=1 \
         -o $@ \
         --post-js build/downworker-post.js \
         --pre-js js/crypt-pre.js

   clean:
      rm -rf build
   ```

### Upload (Encryption)

#### WebAssembly (JavaScript)


##### `$REPO/swift_browser_ui_frontend/wasm/js/crypt-post-upworker.js`

This file has been modified to remove the encryption in the upload process. Changes described as follows:

1. **Changes in `createUploadSession()` Function**: The function calls to the `c` functions `read_in_recv_keys_path()`, `wrap_chunk_content()` and `wrap_chunk_len()` were removed.

2. **Removed `createUploadSessionFile()` and `encryptChunk()` Functions**: `createUploadSessionFile()` was responsible for creating a file header using encryption keys and session information. `encryptChunk()` was responsible for encrypting a single chunk of an upload. Both are not longer needed.

3. **Changes in `StreamSlicer` Class**:
   - Removed the call to `encryptChunk()` in the `getChunk()` function.
   - Return `return new Uint8Array(enBuffer);` in the `getChunk()` function directly return the chunk without encryption.
   - Removed the call to `free_crypt4gh_session_key()` in the `finishFile()` function.

4. **Changes in `openWebSocket()` Function**: Function calls to `waitAsm()` and `libinit()` removed.

5. **Changes in `addFiles` Function**:
   - Removed the `.c4gh` extension from the `path` variable.
   - Removed the call to `createUploadSessionFile()` function.
   - Removed the `data` property from the `msg` object in the loop, indicating that the file header data is no longer sent as part of the message. Instead of `"add_header"` command, the command `"start_upload"` is sent to initiate the upload process.
      ```js
      let msg = {
      command: "start_upload",
      container: container,
      object: path,
      name: uploads[container].projectName,
      total: totalBytes,
      };
      ```


#### Back-End (Python)

##### `$REPO/swift_browser_ui/upload/api.py`

In the `handle_upload_ws()` function the command `"add_header"` was chnaged to `"start_upload"` to work with the change mentioned in the `addFiles()` function.
   ```python
   # Open msgpack and handle message
         try:
               msg_unpacked: typing.Dict[str, typing.Any] = msgpack.unpackb(msg.data)

               if msg_unpacked["command"] == "start_upload":
                  await upload_session.handle_begin_upload(msg_unpacked)
               if msg_unpacked["command"] == "add_chunk":
                  await upload_session.handle_upload_chunk(msg_unpacked)
               if msg_unpacked["command"] == "add_chunks":
                  await upload_session.handle_upload_chunks(msg_unpacked)
               if msg_unpacked["command"] == "cancel":
                  await upload_session.handle_close()
               if msg_unpacked["command"] == "finish":
                  await upload_session.handle_finish_upload(msg_unpacked)
         except ValueError:
               LOGGER.error("Received an empty message.")
               LOGGER.debug(msg.data)
         except msgpack.exceptions.ExtraData:
               LOGGER.error("Extra data in message.")
               LOGGER.debug(msg.data)
         except msgpack.exceptions.FormatError:
               LOGGER.error("Incorrectly formatted message.")
               LOGGER.error(msg.data)
   ```

##### `$REPO/swift_browser_ui/upload/cryptupload.py`

1. In the `handle_begin_upload()` function the last line
   ```python
   await self.uploads[container][path].add_header(bytes(msg["data"]))
   ```
   was changed to
   ```python
   await self.uploads[container][path].init_upload()
   ```

2. The `init_upload()` function is basically the old `add_header()` function without the encryption header part.
   ```python
   async def init_upload(self) -> None:
         """Initialize the upload."""
         if (
               not await self.a_create_container()
               and self.socket is not None
               and not self.socket.closed
         ):
               await self.socket.send_bytes(
                  msgpack.packb(
                     {
                           "command": "abort",
                           "container": self.container,
                           "object": self.path,
                           "reason": "Could not create or access the container.",
                     }
                  )
               )
               self.failed = True

         self.tasks = [
               asyncio.create_task(self.upload_segment(i))
               for i in range(0, self.total_segments)
         ]

         await self.start_upload()
   ```

### Download (Decryption)

#### WebAssembly (JavaScript)

##### `$REPO/swift_browser_ui_frontend/wasm/js/crypt-post-downworker.js`

This file has been modified to remove the decryption in the download process. Changes described as follows:

1. `let libinitDone = true; ` was changed to true and the calls to `waitAsm()` and `libinit()` (at the end of the file) were removed.

2. **Changes in `createDownloadSession()` Function**:
- The function calls to the `c` functions `create_keypair()` and `get_keypair_public_key()` were removed.
- `keypair` and `pubkey` properties removed from the `downloadsp[id]` object.

3. **Changes in `createDownloadSessionFile()` Function**:
- The function call to `get_session_key_from_header()` was removed.
- `key` property in `downloads[id].files[path]` was set to 0 since no decryption will be used.
- removed header decryption related code.
- `return true` always return true since decryption is not needed.
   ```js
   // Add a file to the download session
   function createDownloadSessionFile(id, container, path, header, url, size) {
   if (checkPollutingName(path)) return;

   let headerPath = `header_${container}_`
      + Math.random().toString(36)
      + Math.random().toString(36);
   FS.writeFile(
      headerPath,
      header,
   );

   downloads[id].files[path] = {
      key: 0, // Set key to 0 since no decryption will be used
      url: url,
      size: getFileSize(size, 0),
      realsize: getFileSize(size, 0),
   };

   return true; // Always return true since decryption is not needed
   }
   ```
4. **Removed `decryptChunk()` Function**: `decryptChunk()` was responsible for decrypting a single chunk of a download. Not longer needed.

5. **Changes in `FileSlicer` Class**:
- In the `concatFile()` function the concatination of the headers decryption functions were removed.
- The `sliceFile()` function was changed and modified.
   ```js
   async sliceFile() {
      // Get the first chunk from stream
      await this.getStart();

      // Slice the file and write content to output
      while (!this.done) {
         if (aborted) return;
         await this.getSlice();

         if (this.output instanceof WritableStream) {
         // Write the contents directly in the file stream if
         // downloading to File System
         if (this.bytes > 0) {
            await this.output.write(new Uint8Array(this.enChunkBuf.subarray(0, this.bytes)));
         }
         } else {
         // Otherwise queue to the streamController since we're using a
         // ServiceWorker for downloading
         while(this.output.desiredSize <= 0) {
            await timeout(10);
         }
         if (this.bytes > 0) {
         this.output.enqueue(new Uint8Array(this.enChunkBuf.subarray(0, this.bytes)));
         }
         }
      }

      // Round up to a multiple of 512, because tar
      await this.padFile();

      return true;
   }
   ```

6. **Changes in `finishDownloadSession()` Function**: The call to `free_keypair()` was removed.

7. **Changes in `beginDownloadInSession()` Function**:
- Changed `let path = file.replace(".c4gh", "");` to `let path = file;`.
- Changed the `slicer` instance logic
   ```js
   const slicer = new FileSlicer(
         fileStream,
         id,
         file);

      let res;
      // Always use concatFile since there's no decryption key
      res = await slicer.concatFile().catch(() => {
         return false;
         });
      if (!res) {
         if (!aborted) startAbort(!inServiceWorker, "error");
         await abortDownload(id, fileStream);
         return;
      }
   ```

8. **Changes in `addEventListener()` Function**:
- In every call to `createDownloadSession()` function when `postMessage()` function is called, `pubkey: downloads[e.data.id].pubkey` was removed from every call.


### Console Log PUT 502 (Missing Public Key) error

While pressing the Download button. In the browser's console log this error was received:

![Screenshot from 2024-06-06 08-57-31](https://github.com/DeRuina/swift_browser_ui/assets/81315494/93a635fa-f2b3-4869-af5c-1b2f8f80aff8)


In order to solve that error I have made these changes in `$REPO/swift_browser_ui/common/vault_client.py` in the `put_whitelist_key()` function
   ```python
   async def put_whitelist_key(
         self, project: str, flavor: str, public_key: bytes
      ) -> None:
         """Update the project's whitelisted key.

         :param project: Project ID
         :param flavor: Public key flavor: one of crypt4gh or ed25519
         :param public_key: Public key bytes
         """
         await self._request(
               "POST",
               f"c4ghtransit/whitelist/{project}/{self.service}/{self._key_name}",
               json_data={
                  "flavor": flavor,
                  "pubkey": 0,  # to resolve missing pubkey error
               },
         )
   ```


### Removing "Advanced encryption options" from the Upload Front-End

As can be seen in the picture below the "Advanced excryption options" are not longer needed and were removed.

![Screenshot from 2024-06-06 16-04-39](https://github.com/DeRuina/swift_browser_ui/assets/81315494/2a7d43a9-7d3d-4181-82a9-2bd6570c765d)


1. **Changes in `$REPO/swift_browser_ui_frontend/src/common/lang.js`**: Under `encrypt:` both in the English and the Finnish languages `multipleReceivers:`, `pubkey:`, `pubkeyLabel:`, `pubkeyError:`, `noRecipients:`, `addkey:` and `advancedOptions:` were all removed.

2. **Changes in `$REPO/swift_browser_ui_frontend/src/components/UploadModal.vue`**: Under `id="accordion"` this code was removed:
   ```vue
            <c-accordion-item
               :heading="$t('message.encrypt.advancedOptions')"
               :value="$t('message.encrypt.advancedOptions')"
            >
               <c-container>
               <c-flex>
                  <h3 class="title is-6">
                     {{ $t('message.encrypt.multipleReceivers') }}
                  </h3>
                  <c-text-field
                     v-model="addRecvkey"
                     v-csc-control
                     :label="$t('message.encrypt.pubkey')"
                     type="text"
                     rows="2"
                     :valid="validatePubkey(addRecvkey) || addRecvkey.length === 0"
                     :validation="$t('message.encrypt.pubkeyError')"
                  />
                  <c-button
                     :disabled="!validatePubkey(addRecvkey)"
                     @click="appendPublicKey"
                     @keyup.enter="appendPublicKey"
                  >
                     {{ $t("message.encrypt.addkey") }}
                  </c-button>
                  Footer options needs to be in CamelCase,
                  because csc-ui wont recognise it otherwise.
                  <c-data-table
                     class="publickey-table"
                     :data.prop="recvHashedKeys"
                     :headers.prop="publickeyHeaders"
                     :no-data-text="$t('message.encrypt.noRecipients')"
                     :pagination.prop="keyPagination"
                     :footerOptions.prop="{hideDetails: true}"
                     @click="checkPage($event,true)"
                  />
               </c-flex>
               </c-container>
            </c-accordion-item>
   ```

### Buckets instead of Folders, Added Bucket icon and File icon

Changes were made in these files:

1. **`$REPO/swift_browser_ui_frontend/src/common/bucketOverride.js` File Created**: All the necessary wording that will override the `lang.js` file when the toggle is pressed.

2. **Changes in `$REPO/swift_browser_ui_frontend/src/components/BrowserMainNavbar.vue`**: Root icons are buckets, if the bucket is full there will be folder and file icons.

3. **Changes in `$REPO/swift_browser_ui_frontend/src/components/ContainerTable.vue`**:  Root icons are buckets, if the bucket is full there will be folder and file icons.

4. **Changes in `$REPO/swift_browser_ui_frontend/src/components/ObjectTable.vue`**:  Root icons are buckets, if the bucket is full there will be folder and file icons.

5. **Changes in `$REPO/swift_browser_ui_frontend/src/components/CObjectTable.vue`**: Root icons are buckets, if the bucket is full there will be folder and file icons.

### Own local npm package for color chnage (Dark blue)

1. **csc-ui local npm package added**

2. **`package.json` change**: using modified npm package - https://www.npmjs.com/package/allas-ui?activeTab=readme

3. **`dockerfiles/Dockerfile-build-crypt` Change**: copies of the local `csc-ui` added


### $REPO/swift_browser_frontend/src/commoon/conv.js

Rewrote the `getHumanReadableSize` function and deleted the `shiftSizeDivision` helper function. Function is using toFixed will will round up to the nearest value, for example 8.08TiB would become 8.1TiB

### $REPO/swift_browser_ui/ui/api.py
Buffer added which fixed the big project loading/ fetching bug

```py
async def swift_list_containers(
    request: aiohttp.web.Request,
) -> aiohttp.web.StreamResponse:
    """Proxy Swift list buckets available to a project."""
    session = await aiohttp_session.get_session(request)
    client = request.app["api_client"]

    project = request.match_info["project"]
    request.app["Log"].info(
        "API call for list buckets from "
        f"{request.remote}, session: {session} :: {time.ctime()}"
    )

    # as of v 3.9.1 the return type of query is "MultiMapping[str]"
    # however the actual function returns MultiDictProxy which has copy
    # https://github.com/aio-libs/multidict/blob/master/multidict/_multidict_py.py#L146-L163
    query = request.query.copy()  # type: ignore[attr-defined]
    query["format"] = "json"
    try:
        async with client.get(
            session["projects"][project]["endpoint"],
            headers={"X-Auth-Token": session["projects"][project]["token"]},
            params=query,
        ) as ret:
            resp = aiohttp.web.StreamResponse(status=ret.status)
            await resp.prepare(request)
            if ret.status == 200:
                buffer = b""
                async for chunk in ret.content.iter_chunked(65535):
                    buffer += chunk
                try:
                    containers = json.loads(buffer)
                    tasks = [
                        _check_last_modified(request, container)
                        for container in containers
                    ]
                    ret = await asyncio.gather(*tasks)
                    chunk = json.dumps(ret).encode()
                    await resp.write(chunk)
                except json.JSONDecodeError as e:
                    request.app["Log"].error(
                        f"JSONDecodeError: {e} with data: {buffer[:500]}..."
                    )
            await resp.write_eof()
        return resp
    except KeyError:
        raise aiohttp.web.HTTPForbidden(
            reason="Account does not have access to the project."
        )
```
