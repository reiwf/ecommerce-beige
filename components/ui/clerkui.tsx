const clerkAppearance = {
    baseTheme: undefined,
    elements: {
      formButtonPrimary: 
        "bg-beige-900 hover:bg-beige-800 text-white rounded-lg px-4 py-2.5 font-medium transition-colors",
      formButtonSecondary:
        "bg-beige-50 hover:bg-beige-100 border border-beige-200 text-beige-900 rounded-lg px-4 py-2.5 font-medium transition-colors",
      card: 
        "bg-white shadow-md rounded-xl p-8 border border-beige-100",
      headerTitle: 
        "text-beige-900 text-2xl font-semibold mb-2",
      headerSubtitle: 
        "text-beige-600 text-base mb-6",
      socialButtonsBlockButton: 
        "w-full border border-beige-200 hover:bg-beige-50 text-beige-900 rounded-lg p-3 transition-colors",
      socialButtonsBlockButtonText: 
        "text-beige-900 font-medium ml-3",
      dividerLine: 
        "bg-beige-200",
      dividerText: 
        "text-beige-500 bg-white px-3",
      formFieldLabel: 
        "text-beige-700 font-medium mb-1.5",
      formFieldInput: 
        "w-full rounded-lg border-beige-200 bg-white px-4 py-2.5 text-beige-900 focus:border-beige-400 focus:ring-beige-400 transition-colors",
      footerActionLink: 
        "text-beige-900 hover:text-beige-700 font-medium",
      footerActionText: 
        "text-beige-600",
      identityPreviewText: 
        "text-beige-700",
      identityPreviewEditButton: 
        "text-beige-900 hover:text-beige-700 font-medium",
      userButtonPopoverCard:
        "bg-white shadow-lg rounded-xl border border-beige-100 overflow-hidden",
      userButtonPopoverActionButton:
        "w-full text-left px-4 py-2.5 text-beige-700 hover:text-beige-900 hover:bg-beige-50 transition-colors",
      userButtonPopoverActionButtonText:
        "text-beige-900 font-medium",
      userButtonPopoverFooter:
        "border-t border-beige-100 bg-beige-50/50 px-4 py-3",
      userPreviewMainIdentifier:
        "text-beige-900 font-medium",
      userPreviewSecondaryIdentifier:
        "text-beige-600 text-sm",
      avatarBox: 
        "rounded-full ring-2 ring-white",
      userButtonTrigger:
        "rounded-full focus:shadow-none focus:ring-2 focus:ring-beige-300",
    },
    layout: {
      socialButtonsPlacement: "bottom" as const,
      socialButtonsVariant: "blockButton" as const,
      helpPageURL: "/help",
      privacyPageURL: "/privacy",
      termsPageURL: "/terms",
    },
    variables: {
      colorPrimary: "#8B7355",
      colorBackground: "#FFFFFF",
      colorText: "#3E2723",
      colorTextSecondary: "#6B5E5A",
      colorInputBackground: "#FFFFFF",
      colorInputText: "#3E2723",
      colorSuccess: "#4A5D4A",
      colorDanger: "#8B4513",
      borderRadius: "0.75rem",
      spacingUnit: "4px",
    }
  }

  export default clerkAppearance;