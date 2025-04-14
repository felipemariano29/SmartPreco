import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Header } from "@/components/Header";
import { styles } from "@/styles/add-product";

export default function AddProductScreen() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [market, setMarket] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleSave = () => {
    if (!productName.trim()) {
      Alert.alert("Atenção", "Por favor, informe o nome do produto");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Atenção", "Por favor, informe o preço");
      return;
    }

    if (!market.trim()) {
      Alert.alert("Atenção", "Por favor, informe o mercado");
      return;
    }

    const productData = {
      name: productName,
      price,
      market,
      imageUri: image,
    };

    Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
    console.log(productData);

    setProductName("");
    setPrice("");
    setMarket("");
    setImage(null);
  };

  const handleSelectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão Negada",
        "Precisamos de permissão para acessar sua galeria"
      );
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Houve um problema ao selecionar a imagem");
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão Negada",
        "Precisamos de permissão para acessar sua câmera"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Selecionar Imagem",
      "Escolha uma opção",
      [
        {
          text: "Câmera",
          onPress: handleTakePhoto,
        },
        {
          text: "Galeria",
          onPress: handleSelectImage,
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Adicionar Produto</Text>

          <View style={styles.imageSection}>
            <Text style={styles.imageLabel}>Imagem de comprovação</Text>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={showImageOptions}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.productImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <IconButton icon="image-off" size={30} />
                </View>
              )}
              <TouchableOpacity
                style={styles.editButton}
                onPress={showImageOptions}
              >
                <IconButton icon="pencil" size={18} style={styles.editIcon} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Nome do produto</Text>
            <TextInput
              style={styles.input}
              value={productName}
              onChangeText={setProductName}
              placeholder="Ex: Arroz Integral 1kg"
            />

            <Text style={styles.inputLabel}>Preço</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Ex: 10,90"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Mercado</Text>
            <TextInput
              style={styles.input}
              value={market}
              onChangeText={setMarket}
              placeholder="Ex: Supermercado ABC"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
