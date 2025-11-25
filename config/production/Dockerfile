FROM denoland/deno:alpine

EXPOSE 8000

WORKDIR /app

COPY . .

RUN deno cache src/Main/Main.ts

CMD ["deno", "task", "run"]