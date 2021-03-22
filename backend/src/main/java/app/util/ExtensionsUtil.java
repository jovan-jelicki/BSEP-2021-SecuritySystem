package app.util;

import java.util.List;

public class ExtensionsUtil {

    public ExtensionsUtil() {
    }

    public static int convertKeyUsageArrayToInt(List<Boolean> keyUsageList){
        int retVal = 0;
        for (int i = 0; i < keyUsageList.size(); i++){
            if(keyUsageList.get(i)){
                retVal += Math.pow(2, i);
            }
        }
        return retVal;
    }
}
