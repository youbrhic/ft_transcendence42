FROM nginx/nginx-prometheus-exporter:1.3.0

EXPOSE 9113

CMD ["--nginx.scrape-uri=http://nginx/stub_status", "--web.listen-address=:9113"]