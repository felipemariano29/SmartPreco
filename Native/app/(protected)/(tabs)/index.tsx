import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { SearchResults } from "@/components/home/SearchResults";
import { styles } from "@/styles/home";
import { FavoritesRow } from "@/components/home/FavoritesRow";
import { ProductCard } from "@/components/home/ProductsCard";

export type ItemType = {
  id: number;
  name: string;
  price: string;
  image: null;
  type: "product" | "market";
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const recentProducts: ItemType[] = [
    {
      id: 1,
      name: "Leite Integral 1L",
      price: "R$ 5,49",
      image: null,
      type: "product",
    },
    {
      id: 2,
      name: "Arroz 5kg",
      price: "R$ 21,90",
      image: null,
      type: "product",
    },
    {
      id: 3,
      name: "Feijão Carioca 1kg",
      price: "R$ 7,85",
      image: null,
      type: "product",
    },
    {
      id: 4,
      name: "Óleo de Soja 900ml",
      price: "R$ 6,49",
      image: null,
      type: "product",
    },
    {
      id: 5,
      name: "Açúcar Refinado 1kg",
      price: "R$ 4,29",
      image: null,
      type: "product",
    },
    {
      id: 6,
      name: "Café Torrado 500g",
      price: "R$ 13,75",
      image: null,
      type: "product",
    },
    {
      id: 7,
      name: "Macarrão Espaguete 500g",
      price: "R$ 3,99",
      image: null,
      type: "product",
    },
    {
      id: 8,
      name: "Molho de Tomate 340g",
      price: "R$ 2,59",
      image: null,
      type: "product",
    },
  ];

  const favorites: ItemType[] = [
    { id: 101, name: "Extra", price: "", image: null, type: "market" },
    { id: 102, name: "Local", price: "", image: null, type: "market" },
    { id: 1, name: "Leite", price: "R$ 5,49", image: null, type: "product" },
    { id: 103, name: "Atacadão", price: "", image: null, type: "market" },
    { id: 3, name: "Feijão", price: "R$ 7,85", image: null, type: "product" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const mockResults: ItemType[] = [
      {
        id: 1,
        name: "Leite Integral Piracanjuba",
        price: "R$ 5,49",
        image: null,
        type: "product",
      },
      {
        id: 104,
        name: "Mercado Pague Menos",
        price: "",
        image: null,
        type: "market",
      },
      {
        id: 2,
        name: "Leite Desnatado Elegê",
        price: "R$ 5,99",
        image: null,
        type: "product",
      },
    ];

    setSearchResults(mockResults);
  };

  const handleLoadMore = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  };

  const renderListHeader = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favoritos</Text>
        <FavoritesRow favorites={favorites} />
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produtos recentes</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Procurar produto ou mercado..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#333"
          inputStyle={styles.searchInput}
        />
      </View>

      {isSearching ? (
        <SearchResults results={searchResults} />
      ) : (
        <FlatList
          data={recentProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.productList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
}
