import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header";
import { styles } from "@/styles/add-product";
import { useCreateProduct } from "@/api/product/product";
import { useQueryClient } from "@tanstack/react-query";
import { ProductCreateDto } from "@/api/model";
import { productSchema } from "@/utils/validation";

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [market, setMarket] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [barcode, setBarcode] = useState((params.barcode as string) || "");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    market?: string;
    imageUri?: string;
    barcode?: string;
    description?: string;
    category?: string;
  }>({});

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProduct({
      mutation: {
        onSuccess: () => {
          ToastAndroid.show(
            "Produto cadastrado com sucesso!",
            ToastAndroid.SHORT
          );
          queryClient.invalidateQueries({ queryKey: ["products"] });
          queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
          queryClient.invalidateQueries({ queryKey: ["readProducts"] });
          queryClient.invalidateQueries({ queryKey: ["getFavoriteProducts"] });
          resetForm();
          router.back();
        },
        onError: (error) => {
          console.error("Erro ao cadastrar produto:", error);
          ToastAndroid.show(
            "Erro ao cadastrar produto. Tente novamente.",
            ToastAndroid.SHORT
          );
        },
      },
    });

  const resetForm = () => {
    setProductName("");
    setPrice(0);
    setMarket("");
    setImage(null);
    setImageBlob(null);
    setBarcode("");
    setDescription("");
    setCategory("");
    setErrors({});
  };

  useEffect(() => {
    if (!barcode) return;

    async function fetchProduct() {
      try {
        console.log("Buscando produto com código:", barcode);
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const json = await res.json();
        console.log("Resposta da API:", json.status);
        if (json.status === 1) {
          const p = json.product;
          setProductName(p.product_name || "");
          setImage(p.image_small_url || null);
        } else {
          Alert.alert("Produto não encontrado na base pública");
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        Alert.alert("Erro ao buscar dados do produto");
      }
    }

    fetchProduct();
  }, [barcode]);

  useEffect(() => {
    if (params.barcode) {
      setBarcode(params.barcode as string);

      if (params.barcodeType) {
        Alert.alert(
          "Código Escaneado",
          `Código de barras ${params.barcode} do tipo ${params.barcodeType} detectado.`
        );
      }
    }
  }, [params]);

  const validateForm = (): boolean => {
    try {
      const formData = {
        name: productName,
        description,
        category,
      };

      console.log("Validando formulário:", formData);
      productSchema.parse(formData);
      console.log("Validação bem-sucedida");

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          formattedErrors[path] = err.message;
        });

        console.log("Erros de validação:", formattedErrors);
        setErrors(formattedErrors);

        const firstError = error.errors[0];
        Alert.alert("Erro de Validação", firstError.message);
      } else {
        console.error("Erro desconhecido:", error);
        Alert.alert("Erro", "Ocorreu um erro ao validar os dados");
      }
      return false;
    }
  };

  const handlePriceChange = (text: string) => {
    const numbers = text.replace(/\D/g, "");

    if (!numbers) {
      setPrice(0);
      return;
    }

    setPrice(Number(numbers));

    if (errors.price) {
      setErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const productData: ProductCreateDto = {
        name: productName,
        description,
        category,
      };

      console.log("Enviando dados do produto:", productData);
      createProduct({ data: productData });
    } catch (error) {
      console.error("Erro ao preparar dados:", error);
      ToastAndroid.show(
        "Erro ao preparar dados do produto. Tente novamente.",
        ToastAndroid.SHORT
      );
    }
  };

  const handleSelectImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão Negada",
          "Precisamos de permissão para acessar sua galeria"
        );
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 0.8,
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setImage(selectedUri);

        // Convert image to blob
        const response = await fetch(selectedUri);
        const blob = await response.blob();
        setImageBlob(blob);

        setErrors((prev) => ({ ...prev, imageUri: undefined }));
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Houve um problema ao selecionar a imagem");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão Negada",
          "Precisamos de permissão para acessar sua câmera"
        );
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 0.8,
      };

      const result = await ImagePicker.launchCameraAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setImage(photoUri);

        // Convert image to blob
        const response = await fetch(photoUri);
        const blob = await response.blob();
        setImageBlob(blob);

        setErrors((prev) => ({ ...prev, imageUri: undefined }));
      }
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      Alert.alert("Erro", "Houve um problema ao capturar a foto");
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

  const openBarcodeScanner = () => {
    router.push("/barcode-scanner");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Adicionar Produto</Text>

          <Text style={styles.inputLabel}>Nome do Produto</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={productName}
            onChangeText={setProductName}
            placeholder="Digite o nome do produto"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.inputLabel}>Preço</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={price.toString()}
            onChangeText={handlePriceChange}
            placeholder="0"
            keyboardType="numeric"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

          <Text style={styles.inputLabel}>Mercado</Text>
          <TextInput
            style={[styles.input, errors.market && styles.inputError]}
            value={market}
            onChangeText={setMarket}
            placeholder="Digite o nome do mercado"
          />
          {errors.market && (
            <Text style={styles.errorText}>{errors.market}</Text>
          )}

          <Text style={styles.inputLabel}>Imagem do Produto</Text>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={showImageOptions}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>
                  Toque para adicionar uma imagem
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {image && (
            <Text style={styles.imageInfo}>
              Imagem selecionada. Toque para alterar.
            </Text>
          )}

          <Text style={styles.inputLabel}>Código de Barras</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={openBarcodeScanner}
            >
              <IconButton icon="barcode-scan" size={24} />
              <Text style={styles.buttonText}>Escanear</Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              value={barcode}
              onChangeText={setBarcode}
              placeholder="Digite o código de barras"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>Descrição</Text>
          <TextInput
            style={[styles.input, errors.description && styles.inputError]}
            value={description}
            onChangeText={setDescription}
            placeholder="Digite a descrição do produto"
            multiline
            numberOfLines={3}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}

          <Text style={styles.inputLabel}>Categoria</Text>
          <TextInput
            style={[styles.input, errors.category && styles.inputError]}
            value={category}
            onChangeText={setCategory}
            placeholder="Digite a categoria do produto"
          />
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}

          <TouchableOpacity
            style={[styles.saveButton, isCreatingProduct && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={isCreatingProduct}
          >
            <Text style={styles.saveButtonText}>
              {isCreatingProduct ? "Salvando..." : "Salvar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
