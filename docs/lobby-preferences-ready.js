// Restore only after every snack module has registered its character.
lobbyCatalogReady=true;
restoreLobbyPreferences(!bootAccountId||bootAccountId===saved.accountId?bootSnackChoice??saved.lastSnack:saved.lastSnack);
