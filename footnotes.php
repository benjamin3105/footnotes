<?php 
function fn_shortcode($atts, $content = null) {

    $atts = shortcode_atts(array(
        'class' => 'tooltip_custom',
        'data-attribute' => '',
        'id' => '',
        'word' => ''
    ), $atts);
    $attribute_string = '';
    
    if ($atts['id']) {
        $footnote_ids = explode(',', $atts['id']);
        $footnote_array = [];

        $args = array(
            'post_type' => 'footnotes',
            'post__in' => $footnote_ids,
            'orderby' => 'title',
            'order' => 'ASC',
            'posts_per_page' => -1							
        );
        $the_query = new WP_Query( $args ); 
        if ( $the_query->have_posts() ) { 
            while ( $the_query->have_posts() ) { 
                $the_query->the_post(); 
                $footnote_array[] = '<li>'.get_the_content().'</li>';
            }
            $string = implode('', $footnote_array); // create string from the array
            $attribute_string .= sprintf(' %s', esc_attr($string));
            wp_reset_postdata(); // Reset the query
        }
    } 

    $word_attribute = esc_attr($atts['word']); // Get the value of the 'word' attribute
        
    return sprintf('<button class="tooltip_custom tooltip-box"> <div class="tooltip_html tooltip-text">%s</div> %s <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg> </button>', htmlspecialchars_decode($attribute_string), $word_attribute, $content);

}

// Register the shortcode
add_shortcode('fn', 'fn_shortcode');

function get_custom_post_types() {
    $footnote_array = array();
    $custom_args = array(
        'post_type' => 'footnotes',
        'orderby' => 'title',
        'order' => 'ASC',
        'posts_per_page' => -1
    );
    $the_query = new WP_Query($custom_args);
    if ($the_query->have_posts()) {
        while ($the_query->have_posts()) {
            $the_query->the_post();
            $footnote_array[] = array(
                'postid' => get_the_ID(),
                'id' => get_the_title(),
                'title' => get_the_content()
            );
        }
        wp_reset_postdata(); // Reset the query
    }
    return $footnote_array;
}

function enqueue_tiny_mce_plugin() {
    wp_enqueue_script('mytinymceplugin', get_template_directory_uri() . '/tiny-mce/tiny-mce.js');
    wp_localize_script('mytinymceplugin', 'mytinymceplugin_vars', array(
        'custom_post_types' => get_custom_post_types(),
    ));
}

// add_action('admin_enqueue_scripts', 'enqueue_tiny_mce_plugin');
add_action('admin_init', 'enqueue_tiny_mce_plugin');

function tiny_mce_add_buttons($plugins) {
    $plugins['mytinymceplugin'] = get_template_directory_uri() . '/tiny-mce/tiny-mce.js';
    return $plugins;
}

function mytheme_enqueue_styles() {
    wp_enqueue_style('mytheme-mce-external', get_template_directory_uri() . '/tiny-mce/css/style.css');
}
add_action('admin_enqueue_scripts', 'mytheme_enqueue_styles');

function tiny_mce_register_buttons($buttons) {
    $newBtns = array(
        'myblockquotebtn'
    );
    $buttons = array_merge($buttons, $newBtns);
    return $buttons;
}

function tiny_mce_new_buttons() {
    add_filter('mce_external_plugins', 'tiny_mce_add_buttons');
    add_filter('mce_buttons', 'tiny_mce_register_buttons');
}
add_action('init', 'tiny_mce_new_buttons');
