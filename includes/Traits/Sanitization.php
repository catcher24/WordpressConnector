<?php

namespace Catcher24\WordPress_Connector\Traits;

/**
 * Trait Sanitization
 *
 * Provides helper methods for sanitizing data.
 *
 * @package Catcher24\WordPress_Connector\Traits
 */
trait Sanitization {

	/**
	 * Recursively sanitize an array of data.
	 *
	 * @param array $data The array to sanitize.
	 * @return array The sanitized array.
	 */
	protected function sanitize_array( array $data ): array {
		$sanitized = [];
		foreach ( $data as $key => $value ) {
			$sanitized_key = sanitize_text_field( $key );
			if ( is_array( $value ) ) {
				$sanitized[ $sanitized_key ] = $this->sanitize_array( $value );
			} elseif ( is_bool( $value ) ) {
				$sanitized[ $sanitized_key ] = rest_sanitize_boolean( $value );
			} elseif ( is_int( $value ) ) {
				$sanitized[ $sanitized_key ] = intval( $value );
			} elseif ( is_float( $value ) ) {
				$sanitized[ $sanitized_key ] = floatval( $value );
			} else {
				$sanitized[ $sanitized_key ] = sanitize_text_field( $value );
			}
		}
		return $sanitized;
	}
}
