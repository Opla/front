# opla-front

[![CircleCI](https://circleci.com/gh/Opla/front.svg?style=svg)](https://circleci.com/gh/Opla/front)

Opla.ai Frontend using Node es7 react and redux.


## Getting started

### Prerequisites

First of all, make sure you have [Node 8.x](https://nodejs.org/en/download/) and
[Yarn](https://yarnpkg.com/en/docs/install) installed.

This project requires a backend application to start. At the moment, you have to
install this [backend application](https://github.com/Opla/backend) by yourself.
In the following, we assume this backend application runs locally and is
available at: `127.0.0.1:8081`.

### Installation

1. Install the (dev) dependencies:

    ```
    $ yarn install
    ```

2. Run the configuration tool:

   ```
   $ bin/opla init
   ```

3. Start the dev environment:

    ```
    $ yarn dev
    ```

This application should be available at: http://127.0.0.1:8080/.

## Docker Image

By default, on docker run, the app will run opla/bin init to try to connect to the backend and register a new app. Please populate `OPLA_API_DOMAIN` and `OPLA_FRONT_CLIENT_NAME` env variables for the frontend to be able to register the backend app properly.

### Configuration
You have 2 options: 
    1. pass ENV variables to override config properties one by one. See Dockerfile `ENV` statement for available environment variables.
    2. override `default.json` by mounting your own `/src/config/config.json` file. You can create such a file for a specific backend instance, by running `bin/opla init` locally, provided that you can connect to that backend.

## Deploy on Kubernetes

### Requirements
You will need :

- (**required**) a Kubernetes cluster with LoadBalancer support. 
- (**required**) [`nginx-ingress-controller`](https://github.com/helm/charts/tree/master/stable/nginx-ingress) with an IP. Even better if you have a domain name pointing to that IP.
- (**required**) `kubectl` locally
- (**required**) [`myke`](https://github.com/goeuro/myke/) (a yaml version of `make`/Makefile) locally. See [here](https://github.com/goeuro/myke/releases) for installation.`
- (**required**) [`tiller`, `helm`](https://docs.helm.sh/using_helm/)
- (optional) [`cert-manager`](https://github.com/helm/charts/tree/master/stable/cert-manager) for let's encrypt certificates, if needed.
- (optional) [`external-storage/snapshots`](https://github.com/kubernetes-incubator/external-storage/tree/master/snapshot) for snapshots and backups of your database, if you need them.

### Helm charts
Helm charts get published at https://opla.github.io/front
You can fetch charts this way : 
```
helm repo add opla-front https://opla.github.io/front
helm repo update
helm fetch opla-front/opla-front
```

### helm install
You can then install opla like any other helm application, and edit configuration by specifying your [values.yaml](https://github.com/Opla/front/blob/master/charts/opla-front/values.yaml) or using `helm --set ...`.

```
helm upgrade --install --namespace <YOUR_NAMESPACE> \
  --set namespace=<YOUR_NAMESPACE> \
  --set api.domain=<YOUR_DOMAIN> \
  --set front.domain=<YOUR_DOMAIN> \
  front opla-front/opla-front
```
TIP: You can use `--set api.domain=$IP.xip.io` `--set front.domain=$IP.xip.io` as domain name if you only have an IP for your loadbalancer. 

Your app is then available at http://<YOUR_NAMESPACE>.<YOUR_DOMAIN>

In general, if you need more details about how we deploy opla, you can have a look at our [CircleCI config.yaml](https://github.com/Opla/front/blob/master/.circleci/config.yml), where we run commands to deploy it.

## Contributing

Please, see the [CONTRIBUTING](CONTRIBUTING.md) file.


## Contributor Code of Conduct

Please note that this project is released with a [Contributor Code of
Conduct](http://contributor-covenant.org/). By participating in this project you
agree to abide by its terms. See [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) file.


## License

opla-front is released under the GPL v2.0+ License. See the bundled
[LICENSE](LICENSE) file for details.
