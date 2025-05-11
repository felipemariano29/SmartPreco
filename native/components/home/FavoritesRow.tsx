import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { router } from "expo-router";
import { ItemType } from "@/app/(protected)/(tabs)";
import { styles } from "@/styles/home/FavoriteRow";

type FavoritesRowProps = {
  favorites: ItemType[];
  onToggleFavorite: (item: ItemType) => void;
};

export const FavoritesRow = ({
  favorites,
  onToggleFavorite,
}: FavoritesRowProps) => {
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

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum favorito adicionado</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {favorites.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigateToDetails(item)}
          style={styles.favoriteItem}
        >
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              {item.price ? (
                <Text style={styles.price}>{item.price}</Text>
              ) : null}
              <Text style={styles.type}>
                {item.type === "market" ? "Mercado" : "Produto"}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
