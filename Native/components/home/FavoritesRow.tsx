import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Avatar } from "react-native-paper";
import { ItemType } from "@/app/(protected)/(tabs)";
import { styles } from "@/styles/home/home-components";

type FavoritesRowProps = {
  favorites: ItemType[];
};

export const FavoritesRow = ({ favorites }: FavoritesRowProps) => {
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

  const renderFavoriteItem = ({ item }: { item: ItemType }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => navigateToDetails(item)}
    >
      <View style={styles.favoriteContent}>
        <Avatar.Icon
          size={40}
          icon={item.type === "market" ? "store" : "package"}
          style={
            item.type === "market" ? styles.marketAvatar : styles.productAvatar
          }
        />

        <View style={styles.favoriteTextContainer}>
          <Text style={styles.favoriteName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.price ? (
            <Text style={styles.favoritePrice}>{item.price}</Text>
          ) : null}
        </View>

        <View
          style={[
            styles.favoriteTag,
            item.type === "market" ? styles.marketTag : styles.productTag,
          ]}
        >
          <Text style={styles.favoriteTagText}>
            {item.type === "market" ? "M" : "P"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={favorites}
      renderItem={renderFavoriteItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.favoritesList}
    />
  );
};
