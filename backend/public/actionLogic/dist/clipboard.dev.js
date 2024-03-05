"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var encryptionTarget = document.getElementById('encryptionResultText');
  var encryptionButton = document.getElementById('copyEncryptionResult');
  var decryptionTarget = document.getElementById('decryptionResultText');
  var decryptionButton = document.getElementById('copyDecryptionResult'); // Init clipboard for encryption result

  var clipboardEncryption = new ClipboardJS(encryptionButton, {
    text: function text() {
      return encryptionTarget.innerText;
    }
  }); // Success action handler for encryption result

  clipboardEncryption.on('success', function (e) {
    var _encryptionTarget$cla;

    var checkIcon = encryptionButton.querySelector('.ki-check');
    var copyIcon = encryptionButton.querySelector('.ki-copy'); // Exit check icon when already showing

    if (checkIcon) {
      return;
    } // Create check icon


    checkIcon = document.createElement('i');
    checkIcon.classList.add('ki-duotone');
    checkIcon.classList.add('ki-check');
    checkIcon.classList.add('fs-2x'); // Append check icon

    encryptionButton.appendChild(checkIcon); // Highlight target

    var classes = ['text-success', 'fw-boldest'];

    (_encryptionTarget$cla = encryptionTarget.classList).add.apply(_encryptionTarget$cla, classes); // Highlight button


    encryptionButton.classList.add('btn-success'); // Hide copy icon

    copyIcon.classList.add('d-none'); // Revert button label after 3 seconds

    setTimeout(function () {
      var _encryptionTarget$cla2;

      // Remove check icon
      copyIcon.classList.remove('d-none'); // Revert icon

      encryptionButton.removeChild(checkIcon); // Remove target highlight

      (_encryptionTarget$cla2 = encryptionTarget.classList).remove.apply(_encryptionTarget$cla2, classes); // Remove button highlight


      encryptionButton.classList.remove('btn-success');
    }, 3000);
  }); // Init clipboard for decryption result

  var clipboardDecryption = new ClipboardJS(decryptionButton, {
    text: function text() {
      return decryptionTarget.innerText;
    }
  }); // Success action handler for decryption result

  clipboardDecryption.on('success', function (e) {
    var _decryptionTarget$cla;

    var checkIcon = decryptionButton.querySelector('.ki-check');
    var copyIcon = decryptionButton.querySelector('.ki-copy'); // Exit check icon when already showing

    if (checkIcon) {
      return;
    } // Create check icon


    checkIcon = document.createElement('i');
    checkIcon.classList.add('ki-duotone');
    checkIcon.classList.add('ki-check');
    checkIcon.classList.add('fs-2x'); // Append check icon

    decryptionButton.appendChild(checkIcon); // Highlight target

    var classes = ['text-success', 'fw-boldest'];

    (_decryptionTarget$cla = decryptionTarget.classList).add.apply(_decryptionTarget$cla, classes); // Highlight button


    decryptionButton.classList.add('btn-success'); // Hide copy icon

    copyIcon.classList.add('d-none'); // Revert button label after 3 seconds

    setTimeout(function () {
      var _decryptionTarget$cla2;

      // Remove check icon
      copyIcon.classList.remove('d-none'); // Revert icon

      decryptionButton.removeChild(checkIcon); // Remove target highlight

      (_decryptionTarget$cla2 = decryptionTarget.classList).remove.apply(_decryptionTarget$cla2, classes); // Remove button highlight


      decryptionButton.classList.remove('btn-success');
    }, 3000);
  });
});