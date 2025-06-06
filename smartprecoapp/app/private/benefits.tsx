import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Clipboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReadBenefits, useClaimBenefit } from "../../api/benefit/benefit";
import type { UserBenefitDto } from "../../api/model";
import { benefitsStyles } from "../../styles/benefits";
import { appColors } from "../../constants/theme";
import { Header } from "@/components/Header";

type FilterType = "all" | "available" | "claimed" | "consumed";

const BenefitsScreen = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const {
    data: benefitsResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useReadBenefits();

  const claimBenefitMutation = useClaimBenefit({
    mutation: {
      onSuccess: (data, variables) => {
        Alert.alert(
          "Benefício Resgatado!",
          `Seu código de validação é: ${data.code}\n\nGuarde este código para usar no estabelecimento.`,
          [
            {
              text: "OK",
              onPress: () => refetch(),
            },
          ]
        );
      },
      onError: (error) => {
        Alert.alert(
          "Erro ao Resgatar",
          "Não foi possível resgatar o benefício. Tente novamente.",
          [{ text: "OK" }]
        );
        console.error("Claim benefit error:", error);
      },
    },
  });

  const benefitsData = benefitsResponse?.data;
  const benefits = benefitsData?.records || [];

  const handleClaimBenefit = (benefitId: string, benefitName: string) => {
    Alert.alert(
      "Resgatar Benefício",
      `Deseja resgatar o benefício "${benefitName}"?\n\nApós o resgate, você receberá um código para usar no estabelecimento.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Resgatar",
          onPress: () => {
            claimBenefitMutation.mutate({ benefitId });
          },
        },
      ]
    );
  };

  const copyCodeToClipboard = (code: string) => {
    Clipboard.setString(code);
    Alert.alert(
      "Código Copiado!",
      "O código foi copiado para a área de transferência.",
      [{ text: "OK" }]
    );
  };

  const filterBenefits = (benefits: UserBenefitDto[]) => {
    switch (filter) {
      case "available":
        return benefits.filter((item) => item.status === "ASSIGNED");
      case "claimed":
        return benefits.filter((item) => item.status === "CLAIMED");
      case "consumed":
        return benefits.filter((item) => item.status === "CONSUMED");
      default:
        return benefits;
    }
  };

  const filteredBenefits = filterBenefits(
    benefits.filter(
      (item): item is UserBenefitDto => "userId" in item && "benefitId" in item
    )
  );

  const renderFilterButtons = () => (
    <View style={benefitsStyles.filterContainer}>
      <TouchableOpacity
        style={[
          benefitsStyles.filterButton,
          filter === "all" && benefitsStyles.filterButtonActive,
        ]}
        onPress={() => setFilter("all")}
      >
        <Text
          style={[
            benefitsStyles.filterButtonText,
            filter === "all" && benefitsStyles.filterButtonTextActive,
          ]}
        >
          Todos ({benefits.length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          benefitsStyles.filterButton,
          filter === "available" && benefitsStyles.filterButtonActive,
        ]}
        onPress={() => setFilter("available")}
      >
        <Text
          style={[
            benefitsStyles.filterButtonText,
            filter === "available" && benefitsStyles.filterButtonTextActive,
          ]}
        >
          Disponíveis ({benefits.filter((b) => b.status === "ASSIGNED").length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          benefitsStyles.filterButton,
          filter === "claimed" && benefitsStyles.filterButtonActive,
        ]}
        onPress={() => setFilter("claimed")}
      >
        <Text
          style={[
            benefitsStyles.filterButtonText,
            filter === "claimed" && benefitsStyles.filterButtonTextActive,
          ]}
        >
          Resgatados ({benefits.filter((b) => b.status === "CLAIMED").length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          benefitsStyles.filterButton,
          filter === "consumed" && benefitsStyles.filterButtonActive,
        ]}
        onPress={() => setFilter("consumed")}
      >
        <Text
          style={[
            benefitsStyles.filterButtonText,
            filter === "consumed" && benefitsStyles.filterButtonTextActive,
          ]}
        >
          Utilizados ({benefits.filter((b) => b.status === "CONSUMED").length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderBenefitItem = ({ item }: { item: UserBenefitDto }) => {
    const benefit = item.benefit;
    if (!benefit) return null;

    const canClaim = item.status === "ASSIGNED";
    const isClaimed = item.status === "CLAIMED";
    const isConsumed = item.status === "CONSUMED";
    const isClaimingThis =
      claimBenefitMutation.isPending &&
      claimBenefitMutation.variables?.benefitId === benefit.id;

    return (
      <TouchableOpacity style={benefitsStyles.benefitCard}>
        {benefit.imageUrl && (
          <Image
            source={{ uri: benefit.imageUrl }}
            style={benefitsStyles.benefitImage}
          />
        )}
        <View style={benefitsStyles.benefitContent}>
          <Text style={benefitsStyles.benefitName}>{benefit.name}</Text>
          <Text style={benefitsStyles.benefitType}>{benefit.type}</Text>
          <Text style={benefitsStyles.benefitDescription} numberOfLines={2}>
            {benefit.description}
          </Text>

          <View style={benefitsStyles.statusContainer}>
            <Text
              style={[
                benefitsStyles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              Status: {getStatusLabel(item.status)}
            </Text>
            {item.code && (
              <TouchableOpacity
                style={benefitsStyles.codeContainer}
                onPress={() => copyCodeToClipboard(item.code!)}
              >
                <Text style={benefitsStyles.codeText}>Código: {item.code}</Text>
                <Text style={benefitsStyles.copyIcon}>📋</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={benefitsStyles.benefitDates}>
            <Text style={benefitsStyles.dateText}>
              Válido de: {formatDate(benefit.validFrom)}
            </Text>
            <Text style={benefitsStyles.dateText}>
              Até: {formatDate(benefit.validTo)}
            </Text>
          </View>

          <View style={benefitsStyles.benefitTimestamps}>
            {item.assignedAt && (
              <Text style={benefitsStyles.timestampText}>
                Atribuído: {formatDateTime(item.assignedAt)}
              </Text>
            )}
            {item.claimedAt && (
              <Text style={benefitsStyles.timestampText}>
                Resgatado: {formatDateTime(item.claimedAt)}
              </Text>
            )}
            {item.consumedAt && (
              <Text style={benefitsStyles.timestampText}>
                Consumido: {formatDateTime(item.consumedAt)}
              </Text>
            )}
          </View>

          <View style={benefitsStyles.actionContainer}>
            {canClaim && (
              <TouchableOpacity
                style={[
                  benefitsStyles.actionButton,
                  benefitsStyles.claimButton,
                  isClaimingThis && benefitsStyles.disabledButton,
                ]}
                onPress={() => handleClaimBenefit(benefit.id, benefit.name)}
                disabled={isClaimingThis}
              >
                {isClaimingThis ? (
                  <ActivityIndicator size="small" color={appColors.surface} />
                ) : (
                  <Text style={benefitsStyles.claimButtonText}>
                    Resgatar Benefício
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {isClaimed && (
              <View
                style={[
                  benefitsStyles.actionButton,
                  benefitsStyles.claimedButton,
                ]}
              >
                <Text style={benefitsStyles.claimedButtonText}>
                  ✓ Benefício Resgatado
                </Text>
              </View>
            )}

            {isConsumed && (
              <View
                style={[
                  benefitsStyles.actionButton,
                  benefitsStyles.consumedButton,
                ]}
              >
                <Text style={benefitsStyles.consumedButtonText}>
                  ✓ Benefício Utilizado
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return appColors.accent;
      case "CLAIMED":
        return appColors.secondary;
      case "CONSUMED":
        return appColors.disabled;
      default:
        return appColors.text;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "Disponível";
      case "CLAIMED":
        return "Resgatado";
      case "CONSUMED":
        return "Utilizado";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const renderEmptyState = () => (
    <View style={benefitsStyles.emptyState}>
      <Text style={benefitsStyles.emptyStateTitle}>
        {filter === "all"
          ? "Nenhum benefício encontrado"
          : `Nenhum benefício ${getFilterLabel(filter)} encontrado`}
      </Text>
      <Text style={benefitsStyles.emptyStateText}>
        {filter === "all"
          ? "Você ainda não possui benefícios disponíveis."
          : `Você não possui benefícios ${getFilterLabel(filter)}.`}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={benefitsStyles.errorState}>
      <Text style={benefitsStyles.errorTitle}>Erro ao carregar benefícios</Text>
      <Text style={benefitsStyles.errorText}>
        Ocorreu um erro ao buscar seus benefícios. Tente novamente.
      </Text>
      <TouchableOpacity
        style={benefitsStyles.retryButton}
        onPress={() => refetch()}
      >
        <Text style={benefitsStyles.retryButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={benefitsStyles.container}>
        <View style={benefitsStyles.header}>
          <Text style={benefitsStyles.headerTitle}>Meus Benefícios</Text>
        </View>
        <View style={benefitsStyles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
          <Text style={benefitsStyles.loadingText}>
            Carregando benefícios...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={benefitsStyles.container}>
        <Header />
        <View style={benefitsStyles.header}>
          <Text style={benefitsStyles.headerTitle}>Meus Benefícios</Text>
        </View>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={benefitsStyles.container}>
      <View style={benefitsStyles.header}>
        <Text style={benefitsStyles.headerTitle}>Meus Benefícios</Text>
        <Text style={benefitsStyles.headerSubtitle}>
          {benefitsData?.count || 0} benefício(s) disponível(is)
        </Text>
      </View>

      {renderFilterButtons()}

      <FlatList
        data={filteredBenefits}
        renderItem={renderBenefitItem}
        keyExtractor={(item) => item.benefitId}
        contentContainerStyle={[
          benefitsStyles.listContainer,
          filteredBenefits.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[appColors.primary]}
            tintColor={appColors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const getFilterLabel = (filter: FilterType) => {
  switch (filter) {
    case "available":
      return "disponíveis";
    case "claimed":
      return "resgatados";
    case "consumed":
      return "utilizados";
    default:
      return "";
  }
};

export default BenefitsScreen;
