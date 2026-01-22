{
  description = "Node.js + Prisma development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
  };

  outputs = {
    self,
    nixpkgs,
    prisma-utils,
    ...
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {inherit system;};
    prisma = prisma-utils.lib.prisma-factory {
        inherit pkgs;
        hash = "sha256-0gGhsv6cwlu7HDRAKRgSSIZ7NCCRo8g+Q3sdADjIAL4=";
        npmLock = ./package-lock.json; # <--- path to our package-lock.json file that contains the version of prisma-engines
      };
    in {
    devShells."${system}".default = pkgs.mkShell {
      env = prisma.env;
      packages = with pkgs; [
        nodejs_22
        nodePackages.pnpm
        typescript
        typescript-language-server
        tsx

        # Prisma CLI and Language Server
        prisma_7
        # openssl_3
        prisma-engines_7
        # prisma-language-server
      ];
      # database env vars 
      DATABASE_URL = postgresql://jonathan:jonathan@localhost:5432/test_waldo;
      TEST_DATABASE_URL = postgresql://jonathan:jonathan@localhost:5432/test_waldo;

      shellHook = ''
          exec zsh
        +  '';
    };
  };
}
