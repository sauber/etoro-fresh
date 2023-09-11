FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-bullseye

RUN apt-get update \
 && apt-get install -y vim neovim \
 && apt-get clean && apt-get autoclean && apt-get autoremove \
 && rm -rf /var/lib/apt/lists/*

ENV DENO_INSTALL=/deno
RUN mkdir -p /deno \
    && curl -fsSL https://deno.land/x/install/install.sh | sh \
    && chown -R vscode /deno

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno