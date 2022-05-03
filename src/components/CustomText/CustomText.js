//React native import
import { Text } from "react-native";

const CustomText = ({
  color = "#000",
  fontSize = 16,
  fontWeight = "normal",
  style,
  children,
}) => {
  return (
    <Text
      style={[
        {
          fontFamily:
            fontWeight === "normal"
              ? "Poppins_400Regular"
              : fontWeight === "medium"
              ? "Poppins_500Medium"
              : "Poppins_700Bold",
          fontSize: fontSize,
          color: color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default CustomText;
