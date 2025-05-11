import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { appColors } from "@/constants/theme";
import { MarketDto } from "@/api/model";
import { styles } from "@/styles/add-product";

interface MarketSelectionStepProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: { markets: MarketDto[] } | undefined;
  isSearching: boolean;
  handleSelectMarket: (market: MarketDto | null) => void;
  handleCreateNewMarket: () => void;
  isCreatingMarket: boolean;
  market: MarketDto | null;
  marketName: string;
  address: string;
  city: string;
  state: string;
  setMarketName: (name: string) => void;
  setAddress: (address: string) => void;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  errors: {
    marketName?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  selectedProduct: any;
  handleChangeProduct: () => void;
}

interface MarketItemProps {
  item: MarketDto;
  onSelect: (market: MarketDto) => void;
}

const MarketItem = ({ item, onSelect }: MarketItemProps) => (
  <TouchableOpacity
    style={styles.marketItem}
    onPress={() => onSelect(item)}
    activeOpacity={0.7}
  >
    <Text style={styles.marketItemName}>{item.name}</Text>
    <Text style={styles.marketItemAddress}>{item.address}</Text>
    <Text style={styles.marketItemLocation}>
      {item.city}, {item.state}
    </Text>
  </TouchableOpacity>
);

const MarketSelectionStep: React.FC<MarketSelectionStepProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  handleSelectMarket,
  handleCreateNewMarket,
  isCreatingMarket,
  market,
  marketName,
  address,
  city,
  state,
  setMarketName,
  setAddress,
  setCity,
  setState,
  errors,
  focusedField,
  setFocusedField,
  selectedProduct,
  handleChangeProduct,
}) => {
  const renderMarketItems = () => {
    if (!searchResults?.markets?.length) return null;

    return searchResults.markets.map((item) => (
      <MarketItem key={item.id} item={item} onSelect={handleSelectMarket} />
    ));
  };

  if (isCreatingMarket) {
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Cadastrar Novo Mercado</Text>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Nome do Mercado</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "marketName" && styles.inputFocused,
              errors.marketName && styles.inputError,
            ]}
            value={marketName}
            onChangeText={setMarketName}
            placeholder="Ex: Supermercado Bom Preço"
            onFocus={() => setFocusedField("marketName")}
            onBlur={() => setFocusedField(null)}
          />
          {errors.marketName && (
            <Text style={styles.errorText}>{errors.marketName}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Endereço</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "address" && styles.inputFocused,
              errors.address && styles.inputError,
            ]}
            value={address}
            onChangeText={setAddress}
            placeholder="Ex: Av. Paulista, 1000"
            onFocus={() => setFocusedField("address")}
            onBlur={() => setFocusedField(null)}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.formGroup, { flex: 2, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Cidade</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "city" && styles.inputFocused,
                errors.city && styles.inputError,
              ]}
              value={city}
              onChangeText={setCity}
              placeholder="Ex: São Paulo"
              onFocus={() => setFocusedField("city")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Estado</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "state" && styles.inputFocused,
                errors.state && styles.inputError,
              ]}
              value={state}
              onChangeText={setState}
              placeholder="Ex: SP"
              maxLength={2}
              autoCapitalize="characters"
              onFocus={() => setFocusedField("state")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.state && (
              <Text style={styles.errorText}>{errors.state}</Text>
            )}
          </View>
        </View>

        {selectedProduct && (
          <View style={styles.selectedProductContainer}>
            <Text style={styles.selectedProductTitle}>Produto Selecionado</Text>
            <View style={styles.selectedProduct}>
              <Text style={styles.selectedProductName}>
                {selectedProduct.name}
              </Text>
              <Text style={styles.selectedProductCategory}>
                {selectedProduct.category}
              </Text>

              <TouchableOpacity
                style={styles.changeProductButton}
                onPress={handleChangeProduct}
              >
                <Text style={styles.changeProductButtonText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Selecionar ou Criar Mercado</Text>

      {market ? (
        <View>
          <View style={styles.selectedMarketContainer}>
            <Text style={styles.selectedMarketTitle}>Mercado Selecionado</Text>
            <View style={styles.selectedMarket}>
              <Text style={styles.selectedMarketName}>{market.name}</Text>
              <Text style={styles.selectedMarketAddress}>{market.address}</Text>
              <Text style={styles.selectedMarketLocation}>
                {market.city}, {market.state}
              </Text>

              <TouchableOpacity
                style={styles.changeMarketButton}
                onPress={() => handleSelectMarket(null)}
              >
                <Text style={styles.changeMarketButtonText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectedProduct && (
            <View style={styles.selectedProductContainer}>
              <Text style={styles.selectedProductTitle}>
                Produto Selecionado
              </Text>
              <View style={styles.selectedProduct}>
                <Text style={styles.selectedProductName}>
                  {selectedProduct.name}
                </Text>
                <Text style={styles.selectedProductCategory}>
                  {selectedProduct.category}
                </Text>

                <TouchableOpacity
                  style={styles.changeProductButton}
                  onPress={handleChangeProduct}
                >
                  <Text style={styles.changeProductButtonText}>Alterar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar mercados existentes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color="#757575"
              style={styles.searchIcon}
            />
          </View>

          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={appColors.primary} />
              <Text style={styles.loadingText}>Buscando mercados...</Text>
            </View>
          ) : searchQuery.length > 2 && searchResults?.markets?.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                Nenhum mercado encontrado para "{searchQuery}"
              </Text>
              <TouchableOpacity
                style={styles.createNewButton}
                onPress={handleCreateNewMarket}
              >
                <Text style={styles.createNewButtonText}>
                  Cadastrar novo mercado
                </Text>
              </TouchableOpacity>
            </View>
          ) : searchQuery.length > 2 ? (
            <View>
              <ScrollView
                style={styles.marketsScrollView}
                nestedScrollEnabled={true}
              >
                {renderMarketItems()}
              </ScrollView>
              <TouchableOpacity
                style={styles.createNewButton}
                onPress={handleCreateNewMarket}
              >
                <Text style={styles.createNewButtonText}>
                  Cadastrar novo mercado
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.initialSelectionContainer}>
              <Text style={styles.initialSelectionText}>
                Digite ao menos 3 caracteres para buscar mercados existentes
              </Text>
              <TouchableOpacity
                style={styles.createNewButton}
                onPress={handleCreateNewMarket}
              >
                <Text style={styles.createNewButtonText}>
                  Cadastrar novo mercado
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedProduct && (
            <View style={styles.selectedProductContainer}>
              <Text style={styles.selectedProductTitle}>
                Produto Selecionado
              </Text>
              <View style={styles.selectedProduct}>
                <Text style={styles.selectedProductName}>
                  {selectedProduct.name}
                </Text>
                <Text style={styles.selectedProductCategory}>
                  {selectedProduct.category}
                </Text>

                <TouchableOpacity
                  style={styles.changeProductButton}
                  onPress={handleChangeProduct}
                >
                  <Text style={styles.changeProductButtonText}>Alterar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default MarketSelectionStep;
