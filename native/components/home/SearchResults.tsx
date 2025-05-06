import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Card, IconButton, Chip } from "react-native-paper";
import { router } from "expo-router";
import { ItemType } from "@/app/(protected)/(tabs)";
import { styles } from "@/styles/home/SearchResults";

type SearchResultsProps = {
  results: ItemType[];
};

export const SearchResults = ({ results }: SearchResultsProps) => {
  const navigateToDetails = (item: ItemType) => {
    if (item.type === "product") {
      router.push({
        pathname: "/product-details",
        params: {
          id: item.id,
          name: item.name,
          price: item.price,
        },
      });
    } else {
      router.push({
        pathname: "/market-details",
        params: {
          id: item.id,
          name: item.name,
        },
      });
    }
  };

  const renderResultItem = ({ item }: { item: ItemType }) => (
    <Card style={styles.resultCard}>
      <View style={styles.resultContent}>
        <View style={styles.resultImageContainer}>
          {item.image ? (
            <Image source={item.image} style={styles.resultImage} />
          ) : (
            <View style={styles.resultPlaceholder} />
          )}
        </View>

        <View style={styles.resultInfo}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Chip
              style={
                item.type === "market" ? styles.marketChip : styles.productChip
              }
              textStyle={styles.chipText}
            >
              {item.type === "market" ? "Mercado" : "Produto"}
            </Chip>
          </View>

          {item.price ? (
            <Text style={styles.resultPrice}>{item.price}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigateToDetails(item)}
          >
            <Text style={styles.detailsButtonText}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>

        <IconButton
          icon="star-outline"
          size={24}
          onPress={() => console.log(`Favoritar ${item.type} ${item.id}`)}
          style={styles.favoriteButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsTitle}>Resultados</Text>
      {results.length === 0 ? (
        <View style={styles.emptyResults}>
          <Text style={styles.emptyResultsText}>
            Nenhum resultado encontrado
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </View>
  );
};
