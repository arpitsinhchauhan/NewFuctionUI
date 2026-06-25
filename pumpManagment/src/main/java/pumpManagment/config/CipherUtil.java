package pumpManagment.config;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.codec.binary.Hex;


public class CipherUtil
{
    private static final Log logger = LogFactory.getLog(CipherUtil.class);
    public static SecretKeySpec specKey = null;
    private static final byte[] keyValue = { 84, 112, 97, 83, 83, 78, 112, 97, 115, 83, 84, 112, 97, 83, 115, 75 };
    private static final String ALGO = "AES";
    //   private static final String PREFIX = "T~!@N#";
    //  private static final String SUFFIX = "$%T^&*";

    public static String encrypt(String Data)
            throws Exception
    {
        Data = "T~!@N#" + Data + "$%T^&*";
        Cipher encryptCipher = Cipher.getInstance("AES");
        encryptCipher.init(1, generateAESKey(new String(keyValue), "UTF-8"));
        return new String(Hex.encodeHex(encryptCipher.doFinal(Data.getBytes("UTF-8"))));
    }

    public static String decrypt(String encryptedData)
            throws Exception
    {
        Cipher decryptCipher = Cipher.getInstance("AES");
        decryptCipher.init(2, generateAESKey(new String(keyValue), "UTF-8"));
        byte[] decValue = decryptCipher.doFinal(Hex.decodeHex(encryptedData.toCharArray()));
        String returnString = new String(decValue);
        returnString = returnString.replace("T~!@N#", "");
        returnString = returnString.replace("$%T^&*", "");
        return returnString;
    }

    private static SecretKeySpec generateAESKey(final String key, final String encoding) {
        try {
            final byte[] finalKey = new byte[16];
            int i = 0;
            for (byte b : key.getBytes(encoding)) {
                finalKey[i++ % 16] ^= b;
            }
            specKey = new SecretKeySpec(finalKey, ALGO);
            return specKey;
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    public static String serialize(String s){
        try {
            return  encrypt(s);
        } catch (Exception e) {
            e.printStackTrace();
            logger.info(e.getMessage());
            logger.error(e);
            return null;
        }
    }

    public static String deserialize(String s){
        try {
            return  decrypt(s);
        } catch (Exception e) {
            e.printStackTrace();
            logger.info(e.getMessage());
            logger.error(e);
            return null;
        }
    }
}