<?php

namespace Catcher24\WordPress_Connector\Libs\API;

use Stevenmaguire\OAuth2\Client\Provider\Keycloak;

class KeycloakPKCEProvider extends Keycloak {

	private $pkceMethod = null;

	public function __construct( array $options = [], array $collaborators = [] ) {
		if ( isset( $options['pkceMethod'] ) ) {
			$this->pkceMethod = $options['pkceMethod'];
			unset( $options['pkceMethod'] );
		}

		parent::__construct( $options, $collaborators );
	}

	protected function getPkceMethod() {
		return $this->pkceMethod ?: parent::getPkceMethod();
	}
}
