<?php
/**
 * Class Users
 *
 * Represents the Users model for Catcher24\WordPress_Connector.
 *
 * @package Catcher24\WordPress_Connector\Models
 */

namespace Catcher24\WordPress_Connector\Models;

use Prappo\WpEloquent\Database\Eloquent\Model;

/**
 * Class Users
 *
 * Represents the Users model for Catcher24\WordPress_Connector.
 *
 * @package Catcher24\WordPress_Connector\Models
 */
class Users extends Model {

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = array( 'user_login' );
}
