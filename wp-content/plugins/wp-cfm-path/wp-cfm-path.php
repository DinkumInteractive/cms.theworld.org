<?php
/*
Plugin Name: WP-CFM Lando path alter
Description: Alters the wpcfm config path
Version: 0.1
*/
// Tell wp-cfm where our config files live

/**
 * @param string $config_dir - Default is "<root>/wp-content/config"
 * @return string
 */
function change_config_dir( $config_dir ) {
    // Change default path to $config_dir if lando.
    $config_dir = '';
    if ( defined( 'PANTHEON_ENVIRONMENT' ) ) {
      // Set the Pantheon environment to test or live
      if ( in_array( PANTHEON_ENVIRONMENT, array('lando') ) ) {
        $config_dir = $_SERVER['DOCUMENT_ROOT'] . '/wp-content/config';
      }
    }

    return $config_dir;
}
add_filter( 'wpcfm_config_dir', 'change_config_dir' );

/**
 * @param string $config_url - Default is "<domain>/wp-content/config"
 * @return string
 */
function change_config_url( $config_url ) {
    // Change default URL to $config_url if lando
    $config_url = '';
    if ( defined( 'PANTHEON_ENVIRONMENT' ) ) {
      // Set the Pantheon environment to test or live
      if ( in_array( PANTHEON_ENVIRONMENT, array('lando') ) ) {
        $config_url = WP_HOME . '/wp-content/config';
      }
    }
    return $config_url;
}
add_filter( 'wpcfm_config_url', 'change_config_url' );
