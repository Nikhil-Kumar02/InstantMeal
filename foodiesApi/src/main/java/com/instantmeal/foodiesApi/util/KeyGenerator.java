package com.instantmeal.foodiesApi.util;

import java.security.SecureRandom;
import java.util.Base64;

public class KeyGenerator {
    public static void main(String[] args) {
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        String base64Key = Base64.getEncoder().encodeToString(key);
        System.out.println("==================================================");
        System.out.println("GENERATED SECURE JWT SECRET KEY (256-bit HS256):");
        System.out.println(base64Key);
        System.out.println("==================================================");
    }
}
