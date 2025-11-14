FROM denoland/deno:2.5.6

WORKDIR /app

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "deno task migrate && deno task run"]