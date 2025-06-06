import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import type { UserBenefitDto } from "../../api/model";
import { benefitsStyles } from "../../styles/benefits";
import { appColors } from "../../constants/theme";

interface BenefitCardProps {
  item: UserBenefitDto;
  onClaim: (benefitId: string, benefitName: string) => void;
  onCopyCode: (code: string) => void;
  isClaimingThis: boolean;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  item,
  onClaim,
  onCopyCode,
  isClaimingThis,
}) => {
  const benefit = item.benefit;
  if (!benefit) return null;

  const canClaim = item.status === "ASSIGNED";
  const isClaimed = item.status === "CLAIMED";
  const isConsumed = item.status === "CONSUMED";

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

  return (
    <TouchableOpacity
      style={[
        benefitsStyles.benefitCard,
        isConsumed && { opacity: 0.6, backgroundColor: "#f5f5f5" },
      ]}
    >
      {benefit.imageUrl && (
        <Image
          source={{ uri: benefit.imageUrl }}
          style={[benefitsStyles.benefitImage, isConsumed && { opacity: 0.7 }]}
        />
      )}
      <View style={benefitsStyles.benefitContent}>
        <Text
          style={[
            benefitsStyles.benefitName,
            isConsumed && { color: appColors.disabled },
          ]}
        >
          {benefit.name}
        </Text>
        <Text
          style={[
            benefitsStyles.benefitType,
            isConsumed && { color: appColors.disabled },
          ]}
        >
          {benefit.type}
        </Text>
        <Text
          style={[
            benefitsStyles.benefitDescription,
            isConsumed && { color: appColors.disabled },
          ]}
          numberOfLines={2}
        >
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
              style={[
                benefitsStyles.codeContainer,
                (isClaimingThis || isConsumed) && benefitsStyles.disabledButton,
              ]}
              onPress={isConsumed ? undefined : () => onCopyCode(item.code!)}
              disabled={isConsumed}
            >
              <Text
                style={[
                  benefitsStyles.codeText,
                  isConsumed && { opacity: 0.6 },
                ]}
              >
                Código: {item.code}
              </Text>
              <Text
                style={[
                  benefitsStyles.copyIcon,
                  isConsumed && { opacity: 0.6 },
                ]}
              >
                📋
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={benefitsStyles.benefitDates}>
          <Text
            style={[
              benefitsStyles.dateText,
              isConsumed && { color: appColors.disabled },
            ]}
          >
            Válido de: {formatDate(benefit.validFrom)}
          </Text>
          <Text
            style={[
              benefitsStyles.dateText,
              isConsumed && { color: appColors.disabled },
            ]}
          >
            Até: {formatDate(benefit.validTo)}
          </Text>
        </View>

        <View style={benefitsStyles.benefitTimestamps}>
          <Text
            style={[
              benefitsStyles.timestampText,
              isConsumed && { color: appColors.disabled },
            ]}
          >
            Atribuído: {formatDateTime(item.assignedAt || "")}
          </Text>
          {item.claimedAt && (
            <Text
              style={[
                benefitsStyles.timestampText,
                isConsumed && { color: appColors.disabled },
              ]}
            >
              Resgatado: {formatDateTime(item.claimedAt || "")}
            </Text>
          )}
          {item.consumedAt && (
            <Text
              style={[
                benefitsStyles.timestampText,
                { color: appColors.disabled },
              ]}
            >
              Utilizado: {formatDateTime(item.consumedAt || "")}
            </Text>
          )}
        </View>

        {canClaim && (
          <TouchableOpacity
            style={[
              benefitsStyles.actionButton,
              benefitsStyles.claimButton,
              isClaimingThis && benefitsStyles.disabledButton,
            ]}
            onPress={() => onClaim(benefit.id, benefit.name)}
            disabled={isClaimingThis}
          >
            {isClaimingThis ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={benefitsStyles.claimButtonText}>Resgatar</Text>
            )}
          </TouchableOpacity>
        )}

        {isClaimed && (
          <View
            style={[benefitsStyles.actionButton, benefitsStyles.claimedButton]}
          >
            <Text style={benefitsStyles.claimedButtonText}>
              ✓ Benefício Resgatado
            </Text>
          </View>
        )}

        {isConsumed && (
          <View
            style={[benefitsStyles.actionButton, benefitsStyles.consumedButton]}
          >
            <Text style={benefitsStyles.consumedButtonText}>
              ✓ Benefício Utilizado
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BenefitCard;
