import {
  PUT,
  GET,
  DELETE,
  getUploadEndpoint,
} from "@/common/api";

// Add a header to the ServiceWorker filesystem
function addHeader(header, fname, fsize) {
  navigator.serviceWorker.ready.then(reg => {
    reg.active.postMessage({
      cmd: "addHeader",
      header: header,
      fileName: fname,
      fileSize: fsize,
    });
  });
}

export function beginDownload() {
  navigator.serviceWorker.ready.then(reg => {
    reg.active.postMessage({
      cmd: "beginDownload",
    });
  });
}

export class DecryptedDownloadSession {
  constructor(
    active,
    project = "",
    objects = [],
    container = "",
    store,
  ) {
    this.object = "";
    this.active = active;
    this.project = project;
    this.objects = objects;
    this.container = container;
    this.$store = store;
    this.finished = false;
    this.stream = undefined;
    this.size = 0;
    this.lastChunk = 0;
    this.chunks = 0;
    this.chunksLeft = 0;
    this.currentFinished = false;
    this.whitelistPath = `/cryptic/${this.active.id}/whitelist`;
    this.endpoint = store.state.uploadEndpoint;

    this.reader = undefined;
    this.chunk = undefined;
    this.readerDone = false;
    this.offset = 0;
    this.remainder = 0;
    this.chunkBuffer = [];
  }

  // Imagine needing a separate function to specify chunk size when reading
  // response streams SMH
  async readChunk() {
    let buffer = new ArrayBuffer(65564);

    let offset = 0;
    let reader = this.stream;

    let done, value;    

    while (offset < buffer.byteLength) {
      done, value = await reader.read(new Uint8Array(
        buffer,
        offset,
        buffer.byteLength - offset,
      ));

      console.log(value);

      if(done) {
        this.finished = true;
        break;
      }
    }

    console.log(buffer);
    return buffer;
  }

  async decryptChunk() { 
    if (this.finished) {
      await navigator.serviceWorker.ready.then(reg => {
        reg.active.postMessage({
          cmd: "decryptionFinishded",
        });
      });
    }
    let buf = await this.readChunk();
    await navigator.serviceWorker.ready.then(reg => {
      reg.active.postMessage({
        cmd: "decryptChunk",
        chunk: buf,
      });
    });
  }

  async getFile(objectUrl) {
    const response = await fetch(objectUrl);
    let reader = response.body.getReader();
    this.reader = reader;
    let { value: chunk, done: readerDone } = await this.reader.read();
    
    this.chunk = chunk;
    this.readerDone = readerDone;

    this.offset = 0;
    this.remainder = 0;
    this.chunkBuffer = [];
  }

  async getSlice() {
    let chunk = this.chunk;
    let readerDone = this.readerDone;
    console.log(this.offset);
    console.log(this.chunk.length);
    while (!readerDone) {
      this.remainder = 65564 - this.chunkBuffer.length;

      console.log(this.remainder);
      console.log(this.chunkBuffer.length);

      this.chunkBuffer = this.chunkBuffer.concat(
        Array.from(
          this.chunk.subarray(this.offset, this.offset + this.remainder),
        ),
      );

      if (this.chunk.length - this.offset > this.remainder) {
        this.offset += this.remainder;
        navigator.serviceWorker.ready.then(reg => {
          // this.chunk = chunk;
          // this.readerDone = readerDone;
          console.log(new Uint8Array(this.chunkBuffer));
          reg.active.postMessage({
            cmd: "decryptChunk",
            chunk: new Uint8Array(this.chunkBuffer),
          });
          this.chunkBuffer = [];
        });
        break;
      } else {
        console.log("ran out, fetching another chunk");
        this.offset = 0;
        ({ value: chunk, done: readerDone } = await this.reader.read());
        this.chunk = chunk;
        this.readerDone = readerDone;
      }
    }
    if (this.readerDone) {
      if (this.chunkBuffer.length > 0) {
        navigator.serviceWorker.ready.then(reg => {
          reg.active.postMessage({
            cmd: "decryptChunk",
            chunk: new Blob(this.chunkBuffer).arrayBuffer(),
          });
        });
      } else {
        navigator.serviceWorker.ready.then(reg => {
          reg.active.postMessage({
            cmd: "decryptionFinished",
          });
        });
      }
    }
  }

  getFileUrl() {
    let fileURL = new URL(
      `/download/${this.project}/${this.container}/${this.object}`,
      document.location.origin,
    );
    fileURL.searchParams.append("project", this.active.id);
    return fileURL;
  }

  async getHeader(pubkey) {
    let upInfo = await getUploadEndpoint(
      this.active.id,
      this.project,
      this.container,
    );
    this.$store.commit("setUploadInfo", upInfo);

    let signatureUrl = new URL(`/sign/${60}`, document.location.origin);
    signatureUrl.searchParams.append("path", this.whitelistPath);
    let signed = await GET(signatureUrl);
    signed = await signed.json();
    let whitelistUrl = new URL(this.whitelistPath, this.endpoint);
    whitelistUrl.searchParams.append("valid", signed.valid);
    whitelistUrl.searchParams.append("signature", signed.signature);
    whitelistUrl.searchParams.append("flavor", "crypt4gh");
    whitelistUrl.searchParams.append(
      "session",
      this.$store.state.uploadInfo.id,
    );
    let resp = await PUT(whitelistUrl, pubkey);
    let headerPath = `/header/${this.active.id}/${this.container}/${this.object}`;
    signatureUrl = new URL(`/sign/${60}`, document.location.origin);
    signatureUrl.searchParams.append("path", headerPath);
    signed = await GET(signatureUrl);
    signed = await signed.json();
    let headerUrl = new URL(headerPath, this.endpoint);
    headerUrl.searchParams.append("valid", signed.valid);
    headerUrl.searchParams.append("signature", signed.signature);
    headerUrl.searchParams.append(
      "session",
      this.$store.state.uploadInfo.id,
    );
    resp = await GET(headerUrl);
    let header = await resp.text();
    header = Uint8Array.from(atob(header), c => c.charCodeAt(0));
    addHeader(
      header,
      this.object.split("/").pop(),
      undefined,
    );
  }

  initServiceWorker() {
    navigator.serviceWorker.addEventListener("message", (e) => {
      e.stopImmediatePropagation();
      switch(e.data.eventType) {
        case "downloadSessionOpened":
          console.log(`Download session was openfed, fetching header with pubkey ${e.data.pubKey}.`);
          this.object = this.objects.pop();
          this.currentFinished = false;
          if (this.object == undefined) {
            this.finished = true;
          }
          this.getHeader(e.data.pubKey).then(() => {
            console.log("got header");
          });
          break;
        case "beginDecryption":
          window.open(new URL("/file", document.location.origin), "_blank");
          this.getFile(this.getFileUrl()).then(() => {
            console.log("Started slicing file.");
            this.getSlice().then(() => {
              console.log("Added first slice to serviceworker.");
            });
          });
          break;
        case "nextDecryptChunk":
          this.getSlice().then(() => {
            console.log("Added new slice to serviceworker.");
          });
          break;
        case "streamClosed":
          (async () => {
            let signatureUrl = new URL(`/sign/${60}`, document.location.origin);
            signatureUrl.searchParams.append("path", this.whitelistPath);
            let signed = await GET(signatureUrl);
            signed = await signed.json();
            let whitelistUrl = new URL(this.whitelistPath, this.endpoint);
            whitelistUrl.searchParams.append("valid", signed.valid);
            whitelistUrl.searchParams.append("signature", signed.signature);
            let resp = await DELETE(whitelistUrl);
            console.log(resp);
            if (this.objects.length > 0) {
              beginDownload();
            }
          })();
          break;
      }
    });
  }
}
