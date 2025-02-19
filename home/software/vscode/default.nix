{
  pkgs,
  inputs,
  ...
}:
let
  java = pkgs.jdk21;
  gradle = pkgs.gradle;
in
{
  home.packages = with pkgs; [ nil ];

  programs.vscode = {
    enable = true;
    enableExtensionUpdateCheck = false;
    enableUpdateCheck = false;
    mutableExtensionsDir = true;

    package = pkgs.vscodium.fhsWithPackages (
      ps: with ps; [
        nil
        rustup
        zlib
      ]
    );
    userTasks = {
      version = "2.0.0";
      tasks = [
        {
          "label" = "Nix Switch";
          "type" = "shell";
          "command" = "nh os switch .";
          "group" = {
            "kind" = "build";
            "isDefault" = true;
          };
        }
      ];
    };

    # extensions = with inputs.nix-vscode-extensions.extensions.x86_64-linux; [
    #   ## Language Support
    #   open-vsx.jnoortheen.nix-ide # https://marketplace.visualstudio.com/items?itemName=jnoortheen.nix-ide
    #   # open-vsx.christian-kohler.path-intellisense # https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense
    #   #open-vsx.rust-lang.rust-analyzer # https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer
    #   # open-vsx.vscjava.vscode-maven # https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-maven
    #   # open-vsx.vscjava.vscode-java-debug # https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug
    #   # open-vsx.redhat.java # https://marketplace.visualstudio.com/items?itemName=redhat.java
    #   # open-vsx.vscjava.vscode-gradle # https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle
    #   # open-vsx.fwcd.kotlin # https://open-vsx.org/extension/fwcd/kotlin
    #   # open-vsx.arrterian.nix-env-selector
    #   # vscode-marketplace.visualstudioexptteam.vscodeintellicode # https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode
    #   vscode-marketplace.dart-code.flutter # https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter
    #   vscode-marketplace.dart-code.dart-code

    #   ## Pretty
    #   open-vsx.kamadorueda.alejandra # https://marketplace.visualstudio.com/items?itemName=kamadorueda.alejandra
    #   vscode-marketplace.esbenp.prettier-vscode

    #   ## Misc
    #   open-vsx.naumovs.color-highlight # https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight
    #   # open-vsx.usernamehw.errorlens # https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens
    #   open-vsx.eamodio.gitlens # https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens
    #   open-vsx.mohammadbaqer.better-folding # https://marketplace.visualstudio.com/items?itemName=MohammadBaqer.better-folding
    #   open-vsx.catppuccin.catppuccin-vsc-icons # https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc-icons
    #   # open-vsx.jasonlhy.hungry-delete # https://marketplace.visualstudio.com/items?itemName=jasonlhy.hungry-delete
    #   open-vsx.wakatime.vscode-wakatime # https://marketplace.visualstudio.com/items?itemName=WakaTime.vscode-wakatime
    #   # open-vsx.bmalehorn.vscode-fish # https://open-vsx.org/extension/bmalehorn/vscode-fish

    #   (inputs.catppuccin-vsc.packages.x86_64-linux.default.override {
    #     accent = "mauve";
    #     boldKeywords = true;
    #     italicComments = true;
    #     italicKeywords = true;
    #     extraBordersEnabled = false;
    #     workbenchMode = "default";
    #     bracketMode = "rainbow";
    #     colorOverrides = { };
    #     customUIColors = { };
    #   })
    # ];

    userSettings = {
      "editor.fontFamily" = "'SpaceMono Nerd Font Mono', 'monospace', monospace";

      "workbench.iconTheme" = "catppuccin-mocha";
      "workbench.list.smoothScrolling" = true;
      "workbench.sideBar.location" = "right";
      "workbench.editor.tabActionLocation" = "left";
      "workbench.panel.defaultLocation" = "bottom";

      "files.autoSave" = "afterDelay";
      "files.trimTrailingWhitespace" = true;

      "window.menuBarVisibility" = "toggle";
      "window.titleBarStyle" = "custom";

      "editor.formatOnSave" = true;
      "editor.formatOnPaste" = true;
      "editor.formatOnType" = true;
      "editor.fontLigatures" = true;
      "editor.cursorSmoothCaretAnimation" = "on";
      "editor.cursorStyle" = "line-thin";
      "editor.pasteAs.enabled" = false;
      "editor.bracketPairColorization.independentColorPoolPerBracketType" = true;
      "editor.defaultFormatter" = "esbenp.prettier-vscode";
      "editor.rulers" = 120;

      "terminal.integrated.cursorBlinking" = true;

      "catppuccin.accentColor" = "pink";

      "git.allowForcePush" = true;
      "git.mergeEditor" = true;
      "github.gitProtocol" = "ssh";
      "git.autoStash" = true;
      "git.countBadge" = "tracked";

      "gitlens.currentLine.enabled" = false;

      "kotlin.inlayHints.typeHints" = true;
      "kotlin.inlayHints.parameterHints" = true;
      "kotlin.inlayHints.chainedHints" = true;

      "nix.enableLanguageServer" = true;
      "nix.formatterPath" = "alejandra";
      "nix.serverPath" = "nil";

      "scss.format.spaceAroundSelectorSeparator" = true;

      "accessibility.underlineLinks" = true;

      "window.zoomLevel" = 1.15;

      "[nix]" = {
        "editor.defaultFormatter" = "kamadorueda.alejandra";
      };

      "workbench.colorTheme" = "Catppuccin Mocha";
      "explorer.confirmDelete" = false;

      "dart.devToolsBrowser" = "default";
      "dart.lineLength" = 160;

      # "java.jdt.ls.java.home" = "/nix/store/59flqcj6x3dxiwjavxkwrycamg0482yb-openjdk-21.0.3+9";
      # "kotlin.java.home" = "/nix/store/59flqcj6x3dxiwjavxkwrycamg0482yb-openjdk-21.0.3+9";

      "redhat.telemetry.enabled" = true;
    };
  };
}
