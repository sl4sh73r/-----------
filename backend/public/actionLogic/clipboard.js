document.addEventListener('DOMContentLoaded', function() {
    const encryptionTarget = document.getElementById('encryptionResultText');
    const encryptionButton = document.getElementById('copyEncryptionResult');
    const decryptionTarget = document.getElementById('decryptionResultText');
    const decryptionButton = document.getElementById('copyDecryptionResult');

    // Init clipboard for encryption result
    var clipboardEncryption = new ClipboardJS(encryptionButton, {
        text: function() {
            return encryptionTarget.innerText;
        }
    });

    // Success action handler for encryption result
    clipboardEncryption.on('success', function(e) {
        var checkIcon = encryptionButton.querySelector('.ki-check');
        var copyIcon = encryptionButton.querySelector('.ki-copy');

        // Exit check icon when already showing
        if (checkIcon) {
            return;
        }

        // Create check icon
        checkIcon = document.createElement('i');
        checkIcon.classList.add('ki-duotone');
        checkIcon.classList.add('ki-check');
        checkIcon.classList.add('fs-2x');

        // Append check icon
        encryptionButton.appendChild(checkIcon);

        // Highlight target
        const classes = ['text-success', 'fw-boldest'];
        encryptionTarget.classList.add(...classes);

        // Highlight button
        encryptionButton.classList.add('btn-success');

        // Hide copy icon
        copyIcon.classList.add('d-none');

        // Revert button label after 3 seconds
        setTimeout(function () {
            // Remove check icon
            copyIcon.classList.remove('d-none');

            // Revert icon
            encryptionButton.removeChild(checkIcon);

            // Remove target highlight
            encryptionTarget.classList.remove(...classes);

            // Remove button highlight
            encryptionButton.classList.remove('btn-success');
        }, 3000)
    });

    // Init clipboard for decryption result
    var clipboardDecryption = new ClipboardJS(decryptionButton, {
        text: function() {
            return decryptionTarget.innerText;
        }
    });

    // Success action handler for decryption result
    clipboardDecryption.on('success', function(e) {
        var checkIcon = decryptionButton.querySelector('.ki-check');
        var copyIcon = decryptionButton.querySelector('.ki-copy');

        // Exit check icon when already showing
        if (checkIcon) {
            return;
        }

        // Create check icon
        checkIcon = document.createElement('i');
        checkIcon.classList.add('ki-duotone');
        checkIcon.classList.add('ki-check');
        checkIcon.classList.add('fs-2x');

        // Append check icon
        decryptionButton.appendChild(checkIcon);

        // Highlight target
        const classes = ['text-success', 'fw-boldest'];
        decryptionTarget.classList.add(...classes);

        // Highlight button
        decryptionButton.classList.add('btn-success');

        // Hide copy icon
        copyIcon.classList.add('d-none');

        // Revert button label after 3 seconds
        setTimeout(function () {
            // Remove check icon
            copyIcon.classList.remove('d-none');

            // Revert icon
            decryptionButton.removeChild(checkIcon);

            // Remove target highlight
            decryptionTarget.classList.remove(...classes);

            // Remove button highlight
            decryptionButton.classList.remove('btn-success');
        }, 3000)
    });
});