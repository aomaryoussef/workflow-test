package utilities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;

public class JsonFileManager {
    public static void readFileAsString(String key, String jsonFilePath) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        File jsonFile = new File(jsonFilePath);
        try {
            JsonNode rootNode = mapper.readTree(jsonFile);
            Object value = findValueByKey(rootNode, key);
            if (value != null) {
                System.out.println("Value: " + value.toString());
            } else {
                System.out.println("Key not found.");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private static Object findValueByKey(JsonNode node, String key) {
        if (node.isObject()) {
            JsonNode valueNode = node.get(key);
            if (valueNode != null) {
                return getValueFromNode(valueNode);
            } else {
                for (JsonNode childNode : node) {
                    Object value = findValueByKey(childNode, key);
                    if (value != null) {
                        return value;
                    }
                }
            }
        } else if (node.isArray()) {
            for (JsonNode childNode : node) {
                Object value = findValueByKey(childNode, key);
                if (value != null) {
                    return value;
                }
            }
        }
        return null;
    }

    private static Object getValueFromNode(JsonNode node) {
        if (node.isTextual()) {
            return node.textValue();
        } else if (node.isInt()) {
            return node.intValue();
        } else if (node.isLong()) {
            return node.longValue();
        } else if (node.isDouble()) {
            return node.doubleValue();
        } else if (node.isBoolean()) {
            return node.booleanValue();
        }
        return null;
    }
}
