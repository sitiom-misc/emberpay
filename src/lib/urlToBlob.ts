// https://github.com/expo/expo/issues/2402#issuecomment-443726662
// https://github.com/expo/firebase-storage-upload-example/issues/15#issuecomment-442142654
function urlToBlob(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
}

export default urlToBlob;
