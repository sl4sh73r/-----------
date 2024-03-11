$(document).ready(function(){
    $("#inputTypeEncryption").focus(function(){
        $("#icon-encryption").css("transform", "translateY(-50%) rotate(180deg)");
    });
    $("#inputTypeEncryption").blur(function(){
        $("#icon-encryption").css("transform", "translateY(-50%)");
    });

    $("#inputTypeDecryption").focus(function(){
        $("#icon-decryption").css("transform", "translateY(-50%) rotate(180deg)");
    });
    $("#inputTypeDecryption").blur(function(){
        $("#icon-decryption").css("transform", "translateY(-50%)");
    });
});

// TODO: Add the logic to the select for algorithm encryption and decryption