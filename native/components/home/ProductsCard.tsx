import React from "react";
import { View, Text, Image } from "react-native";
import { Card, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { ItemType } from "@/app/(protected)/(tabs)";
import { styles } from "@/styles/home/ProductsCard";

type ProductCardProps = {
  product: ItemType;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigateToProductDetails = () => {
    router.push({
      pathname: "/product-details",
      params: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
    });
  };

  return (
    <Card style={styles.productCard} onPress={navigateToProductDetails}>
      <View style={styles.productContent}>
        <View style={styles.productImageContainer}>
          {product.image ? (
            <Image source={product.image} style={styles.productImage} />
          ) : (
            <View style={styles.productPlaceholder} />
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price}</Text>
        </View>

        <IconButton
          icon="star-outline"
          size={24}
          onPress={() => console.log(`Favoritar produto ${product.id}`)}
          style={styles.favoriteButton}
        />
      </View>
    </Card>
  );
};
