import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const FAVORITE_WIDTH = width * 0.28;

export const styles = StyleSheet.create({
  // FavoritesRow Styles
  favoritesList: {
    paddingVertical: 5,
  },
  favoriteItem: {
    width: FAVORITE_WIDTH,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 2,
    overflow: "hidden",
  },
  favoriteContent: {
    padding: 8,
    position: "relative",
    alignItems: "center",
    height: 90,
  },
  favoriteTextContainer: {
    marginTop: 6,
    alignItems: "center",
  },
  favoriteName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  favoritePrice: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2e8b57",
    marginTop: 2,
  },
  favoriteTag: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  marketTag: {
    backgroundColor: "#e6f7ff",
  },
  productTag: {
    backgroundColor: "#f6ffed",
  },
  favoriteTagText: {
    fontSize: 8,
    fontWeight: "bold",
  },
  marketAvatar: {
    backgroundColor: "#1890ff",
  },
  productAvatar: {
    backgroundColor: "#52c41a",
  },

  // ProductCard Styles
  productCard: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    backgroundColor: "#fff",
  },
  productContent: {
    flexDirection: "row",
    padding: 12,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginRight: 15,
  },
  productImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  productPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e8b57",
  },
  favoriteButton: {
    alignSelf: "center",
    margin: 0,
  },

  // SearchResults Styles
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultCard: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  resultContent: {
    flexDirection: "row",
    padding: 12,
  },
  resultImageContainer: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginRight: 15,
  },
  resultImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  resultPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
  },
  resultInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginRight: 5,
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e8b57",
    marginVertical: 5,
  },
  detailsButton: {
    backgroundColor: "#2e8b57",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  detailsButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  marketChip: {
    height: 24,
    backgroundColor: "#e6f7ff",
  },
  productChip: {
    height: 24,
    backgroundColor: "#f6ffed",
  },
  chipText: {
    fontSize: 10,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  emptyResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyResultsText: {
    fontSize: 16,
    color: "#666",
  },
});