import { useCreateMarket, useReadMarkets } from "@/api/market/market";
import {
  MarketCreateDto,
  MarketDto,
  ProductCreateDto,
  ProductDto,
} from "@/api/model";
import {
  useCreateProduct,
  useReadProduct,
  useReadProducts,
} from "@/api/product/product";
import { Header } from "@/components/Header";
import Stepper from "@/components/Stepper";
import MarketSelectionStep from "@/components/add-product/MarketSelectionStep";
import PriceDetailsStep from "@/components/add-product/PriceDetailsStep";
import ProductDetailsStep from "@/components/add-product/ProductDetailsStep";
import ProductSelectionStep from "@/components/add-product/ProductSelectionStep";
import { styles } from "@/styles/add-product";
import { productSchema } from "@/utils/validation";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const STEPS = [
  { id: "product-selection", title: "Produto" },
  { id: "product-details", title: "Detalhes" },
  { id: "market-selection", title: "Mercado" },
  { id: "price-details", title: "Preço" },
];

interface ProductItemProps {
  item: ProductDto;
  onSelect: (product: ProductDto) => void;
}

const ProductItem = ({ item, onSelect }: ProductItemProps) => {
  return (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.productItemName}>{item.name}</Text>
      <Text style={styles.productItemCategory}>{item.category}</Text>
    </TouchableOpacity>
  );
};

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();

  // Stepper state
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Step 1: Product selection state
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(
    null
  );
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);

  // Step 2: Product details state
  const [productName, setProductName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [barcode, setBarcode] = useState((params.barcode as string) || "");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  // Step 3: Market selection state
  const [marketSearchQuery, setMarketSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<MarketDto | null>(null);
  const [isCreatingMarket, setIsCreatingMarket] = useState(false);
  const [marketName, setMarketName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [price, setPrice] = useState<number>(0);

  // Step 4: Price details state
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptImageBlob, setReceiptImageBlob] = useState<Blob | null>(null);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    category?: string;
    imageUri?: string;
    marketName?: string;
    address?: string;
    city?: string;
    state?: string;
    price?: string;
    receiptImage?: string;
  }>({});

  // Product search
  const { data: productSearchResults, isLoading: isSearchingProducts } =
    useReadProducts(
      productSearchQuery ? { search: productSearchQuery } : undefined,
      {
        query: {
          enabled: productSearchQuery.length > 2,
        },
      }
    );

  // Market search
  const { data: marketSearchResults, isLoading: isSearchingMarkets } =
    useReadMarkets(
      marketSearchQuery ? { search: marketSearchQuery } : undefined,
      {
        query: {
          enabled: marketSearchQuery.length > 2,
        },
      }
    );

  // Fetch selected product details
  const { data: productDetails, isLoading: isLoadingProduct } = useReadProduct(
    selectedProduct?.id || "",
    {
      query: {
        enabled: !!selectedProduct?.id,
      },
    }
  );

  // Watch for product data and update form fields
  useEffect(() => {
    if (productDetails) {
      setProductName(productDetails.name || "");
      setDescription(productDetails.description || "");
      setCategory(productDetails.category || "");
    }
  }, [productDetails]);

  // Create product mutation
  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProduct({
      mutation: {
        onSuccess: (data) => {
          setSelectedProduct(data);
          ToastAndroid.show(
            "Produto cadastrado com sucesso!",
            ToastAndroid.SHORT
          );
          queryClient.invalidateQueries({ queryKey: ["products"] });
          nextStep();
        },
        onError: (error) => {
          ToastAndroid.show(
            "Erro ao cadastrar produto. Tente novamente.",
            ToastAndroid.SHORT
          );
        },
      },
    });

  // Create market mutation
  const { mutate: createMarket, isPending: isCreatingMarketMutation } =
    useCreateMarket({
      mutation: {
        onSuccess: (data) => {
          setSelectedMarket(data);
          ToastAndroid.show(
            "Mercado cadastrado com sucesso!",
            ToastAndroid.SHORT
          );
          queryClient.invalidateQueries({ queryKey: ["markets"] });
          nextStep();
        },
        onError: (error) => {
          ToastAndroid.show(
            "Erro ao cadastrar mercado. Tente novamente.",
            ToastAndroid.SHORT
          );
        },
      },
    });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedProduct(null);
    setIsCreatingNewProduct(false);
    setProductSearchQuery("");
    setProductName("");
    setPrice(0);
    setMarketName("");
    setImage(null);
    setImageBlob(null);
    setBarcode("");
    setDescription("");
    setCategory("");
    setMarketSearchQuery("");
    setSelectedMarket(null);
    setIsCreatingMarket(false);
    setAddress("");
    setCity("");
    setState("");
    setReceiptImage(null);
    setReceiptImageBlob(null);
    setErrors({});
  };

  useEffect(() => {
    if (!barcode) return;

    async function fetchProduct() {
      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const json = await res.json();
        if (json.status === 1) {
          const p = json.product;
          setProductName(p.product_name || "");
          setImage(p.image_small_url || null);

          if (p.product_name) {
            ToastAndroid.show(
              "Informações do produto carregadas!",
              ToastAndroid.SHORT
            );
          }
        } else {
          Alert.alert(
            "Produto não encontrado",
            "Este código de barras não foi encontrado na base de dados pública."
          );
        }
      } catch (err) {
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

  const validateProductForm = (): boolean => {
    try {
      const formData = {
        name: productName,
        description,
        category,
      };

      productSchema.parse(formData);

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          formattedErrors[path] = err.message;
        });

        setErrors(formattedErrors);

        const firstError = error.errors[0];
        Alert.alert("Erro de Validação", firstError.message);
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao validar os dados");
      }
      return false;
    }
  };

  const validateMarketForm = (): boolean => {
    // Skip validation if using existing market
    if (selectedMarket && !isCreatingMarket) {
      return true;
    }

    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!marketName.trim()) {
      newErrors.marketName = "Nome do mercado é obrigatório";
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = "Endereço é obrigatório";
      isValid = false;
    }

    if (!city.trim()) {
      newErrors.city = "Cidade é obrigatória";
      isValid = false;
    }

    if (!state.trim()) {
      newErrors.state = "Estado é obrigatório";
      isValid = false;
    } else if (state.trim().length !== 2) {
      newErrors.state = "Estado deve ter 2 caracteres";
      isValid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (!isValid) {
      Alert.alert("Erro de Validação", "Preencha todos os campos obrigatórios");
    }

    return isValid;
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

  const formatPrice = (price: number): string => {
    if (price === 0) return "";

    const priceStr = price.toString().padStart(3, "0");

    const reais = priceStr.slice(0, priceStr.length - 2) || "0";
    const centavos = priceStr.slice(priceStr.length - 2);

    const formattedReais = parseInt(reais).toLocaleString("pt-BR");

    return `${formattedReais},${centavos}`;
  };

  const handleSaveProduct = () => {
    if (!validateProductForm()) {
      return;
    }

    if (isCreatingNewProduct) {
      const productData: ProductCreateDto = {
        name: productName,
        description,
        category,
      };
      createProduct({ data: productData });
    } else {
      nextStep();
    }
  };

  const handleSaveMarket = () => {
    if (!validateMarketForm()) {
      return;
    }

    if (isCreatingMarket) {
      const marketData: MarketCreateDto = {
        name: marketName,
        address,
        city,
        state,
      };
      createMarket({
        data: marketData,
      });
    } else {
      nextStep();
    }
  };

  const handleSelectProduct = (product: ProductDto) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setProductSearchQuery("");
    setIsCreatingNewProduct(false);
    nextStep();
  };

  const handleCreateNewProduct = () => {
    setIsCreatingNewProduct(true);
    setSelectedProduct(null);
    setProductName("");
    setDescription("");
    setCategory("");
    nextStep();
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

        try {
          const response = await fetch(selectedUri);
          const blob = await response.blob();
          setImageBlob(blob);
        } catch (blobError) {}

        setErrors((prev) => ({ ...prev, imageUri: undefined }));
      }
    } catch (error) {
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

        try {
          const response = await fetch(photoUri);
          const blob = await response.blob();
          setImageBlob(blob);
        } catch (blobError) {}

        setErrors((prev) => ({ ...prev, imageUri: undefined }));
      }
    } catch (error) {
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

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    } else {
      finishProcess();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    }
  };

  const validatePriceForm = (): boolean => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    if (price <= 0) {
      newErrors.price = "Preço é obrigatório";
      isValid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (!isValid) {
      Alert.alert(
        "Erro de Validação",
        "Informe um preço válido para continuar"
      );
    }

    return isValid;
  };

  const handleSelectReceiptImage = async () => {
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
        setReceiptImage(selectedUri);

        try {
          const response = await fetch(selectedUri);
          const blob = await response.blob();
          setReceiptImageBlob(blob);
        } catch (blobError) {}

        setErrors((prev) => ({ ...prev, receiptImage: undefined }));
      }
    } catch (error) {
      Alert.alert("Erro", "Houve um problema ao selecionar a imagem");
    }
  };

  const handleTakeReceiptPhoto = async () => {
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
        setReceiptImage(photoUri);

        try {
          const response = await fetch(photoUri);
          const blob = await response.blob();
          setReceiptImageBlob(blob);
        } catch (blobError) {}

        setErrors((prev) => ({ ...prev, receiptImage: undefined }));
      }
    } catch (error) {
      Alert.alert("Erro", "Houve um problema ao capturar a foto");
    }
  };

  const showReceiptImageOptions = () => {
    Alert.alert(
      "Selecionar Comprovante",
      "Escolha uma opção",
      [
        {
          text: "Câmera",
          onPress: handleTakeReceiptPhoto,
        },
        {
          text: "Galeria",
          onPress: handleSelectReceiptImage,
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleSavePriceDetails = () => {
    if (!validatePriceForm()) {
      return;
    }

    finishProcess();
  };

  const handleChangeProduct = () => {
    // Go back to product selection step
    setCurrentStep(0);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProductSelectionStep
            searchQuery={productSearchQuery}
            setSearchQuery={setProductSearchQuery}
            searchResults={productSearchResults}
            isSearching={isSearchingProducts}
            handleSelectProduct={handleSelectProduct}
            handleCreateNewProduct={handleCreateNewProduct}
            openBarcodeScanner={openBarcodeScanner}
          />
        );
      case 1:
        return (
          <ProductDetailsStep
            productName={productName}
            setProductName={setProductName}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            isCreatingNewProduct={isCreatingNewProduct}
            image={image}
            showImageOptions={showImageOptions}
            errors={errors}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
          />
        );
      case 2:
        return (
          <MarketSelectionStep
            searchQuery={marketSearchQuery}
            setSearchQuery={setMarketSearchQuery}
            searchResults={marketSearchResults}
            isSearching={isSearchingMarkets}
            handleSelectMarket={handleSelectMarket}
            handleCreateNewMarket={handleCreateNewMarket}
            isCreatingMarket={isCreatingMarket}
            market={selectedMarket}
            marketName={marketName}
            address={address}
            city={city}
            state={state}
            setMarketName={setMarketName}
            setAddress={setAddress}
            setCity={setCity}
            setState={setState}
            errors={errors}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            selectedProduct={selectedProduct}
            handleChangeProduct={handleChangeProduct}
          />
        );
      case 3:
        return (
          <PriceDetailsStep
            productInfo={selectedProduct}
            marketInfo={selectedMarket}
            price={price}
            handlePriceChange={handlePriceChange}
            formatPrice={formatPrice}
            receiptImage={receiptImage}
            showReceiptImageOptions={showReceiptImageOptions}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  const getStepAction = () => {
    switch (currentStep) {
      case 0:
        return selectedProduct ? nextStep : handleCreateNewProduct;
      case 1:
        return handleSaveProduct;
      case 2:
        return handleSaveMarket;
      case 3:
        return handleSavePriceDetails;
      default:
        return () => {};
    }
  };

  const finishProcess = () => {
    ToastAndroid.show(
      "Produto e preço cadastrados com sucesso!",
      ToastAndroid.SHORT
    );
    resetForm();
    router.back();
  };

  const handleSelectMarket = (market: MarketDto | null) => {
    setSelectedMarket(market);
    if (market) {
      setMarketName(market.name);
      setAddress(market.address);
      setCity(market.city);
      setState(market.state);
      setMarketSearchQuery("");
      setIsCreatingMarket(false);
    }
  };

  const handleCreateNewMarket = () => {
    setIsCreatingMarket(true);
    setSelectedMarket(null);
    setMarketName("");
    setAddress("");
    setCity("");
    setState("");
  };

  const isLoading =
    isCreatingProduct ||
    isCreatingMarketMutation ||
    isSearchingProducts ||
    isSearchingMarkets;

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <Stepper steps={STEPS} currentStep={currentStep} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={styles.content}>
          {renderStepContent()}

          <View style={styles.buttonsContainer}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={prevStep}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.nextButton, isLoading && { opacity: 0.7 }]}
              onPress={getStepAction()}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.nextButtonText}>
                {isLoading
                  ? "Carregando..."
                  : currentStep === STEPS.length - 1
                  ? "Finalizar"
                  : "Avançar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
