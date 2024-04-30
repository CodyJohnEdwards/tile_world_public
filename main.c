#define SOKOL_IMPL
#define SOKOL_GLES3
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#include "sokol_gfx.h"
#include "sokol_gp.h"
#include "sokol_app.h"
#include "sokol_glue.h"
#include "sokol_log.h"
#define CIMGUI_DEFINE_ENUMS_AND_STRUCTS
#include "cimgui.h"
#include "sokol_imgui.h"
#include <stdio.h> 
#include <stdlib.h> 
#include <math.h> 

#define MAX_DISTANCE_COLOR 50.0f 

float pos_offset_x = 0.0f;
float pos_offset_y = 0.0f;
#define TILE_SHEET_WIDTH 1340
#define TILE_SHEET_HEIGHT 651
#define TILE_WIDTH 12
#define TILE_HEIGHT 12
#define TILE_SIZE (TILE_WIDTH * TILE_HEIGHT * 4)  // Assuming RGBA format for each pixel
#define BORDER_SIZE 1
#define TILE_FULL_SIZE (TILE_WIDTH + BORDER_SIZE) // Total size including border
#define TILES_PER_ROW (TILE_SHEET_WIDTH / TILE_FULL_SIZE)
#define TILES_PER_COLUMN (TILE_SHEET_HEIGHT / TILE_FULL_SIZE)
#define MAX_TILES (TILES_PER_ROW * TILES_PER_COLUMN)
int curr_tile_x = 0;
int curr_tile_y = 0;
sg_image tiles[MAX_TILES];  // Global array of pointers to store tile data
sg_image tile_map[TILES_PER_ROW][TILES_PER_COLUMN];
static struct {
    sg_pass_action pass_action;
} state;

/**
 * @brief Creates a tile texture pointing to some pixel data in memory
 * 
 * @param file_path 
 * @return sg_image 
 */
static sg_image create_tile_texture(const unsigned char* img_data) {

    sg_image img = sg_make_image(&(sg_image_desc){
        .width = TILE_WIDTH,
        .height = TILE_HEIGHT,
        .pixel_format = SG_PIXELFORMAT_RGBA8,
        .data.subimage[0][0] = {
            .ptr = img_data,
            .size = TILE_WIDTH * TILE_HEIGHT * 4
        },
        .label = "tile"
    });

    // stbi_image_free(img_data);
    return img;
}

unsigned char* extract_tile(unsigned char *source, int x, int y, int img_width) {
    int tile_width = 12;
    int tile_height = 12;
    int bytes_per_pixel = 4;  // Assuming RGBA
    unsigned char *tile = malloc(tile_width * tile_height * bytes_per_pixel);
    if (tile == NULL) {
        return NULL;
    }

    // Calculate the starting position on the source image, skipping the 1px gap for each tile
    int start_x = x * (tile_width + 1) + 1;  // +1 after multiplying to skip the gap
    int start_y = y * (tile_height + 1) + 1; // +1 after multiplying to skip the gap

    int dst_index = 0;
    for (int ty = 0; ty < tile_height; ty++) {
        for (int tx = 0; tx < tile_width; tx++) {
            int src_index = ((start_y + ty) * img_width + (start_x + tx)) * bytes_per_pixel;
            for (int byte = 0; byte < bytes_per_pixel; byte++) {
                tile[dst_index + byte] = source[src_index + byte];
            }
            dst_index += bytes_per_pixel;
        }
    }
    return tile;
}

void extract_tiles(){
    int width, height, channels;
    unsigned char* img_data = stbi_load("./tile_set.png", &width, &height, &channels, 4);
    for (int y = 0; y < TILES_PER_COLUMN; y++) {
        for (int x = 0; x < TILES_PER_ROW; x++) {
            unsigned char *tile = extract_tile(img_data, x, y, TILE_SHEET_WIDTH);
            if (tile) {
//                tiles[y * TILES_PER_ROW + x] = create_tile_texture(tile);
                tile_map[x][y] = create_tile_texture(tile);
                free(tile);
            }
        }
    }
    stbi_image_free(img_data); // Free the loaded image data when done
}
 

static void input(const sapp_event* event) {

    simgui_handle_event(event);

    const float step_offset = 10.0f; // Speed factor for moving the viewport
    if (event->type == SAPP_EVENTTYPE_KEY_DOWN) {
        switch (event->key_code) {
            case SAPP_KEYCODE_W:
                pos_offset_y -= step_offset;
                break;
            case SAPP_KEYCODE_S:
                pos_offset_y += step_offset;
                break;
            case SAPP_KEYCODE_A:
                pos_offset_x -= step_offset;
                break;
            case SAPP_KEYCODE_D:
                pos_offset_x += step_offset;
                break;
            case SAPP_KEYCODE_1:
                curr_tile_x += 1;
                break;
            case SAPP_KEYCODE_2:
                curr_tile_x -= 1;
                break;
            case SAPP_KEYCODE_3:
                curr_tile_y += 1;
                break;
            case SAPP_KEYCODE_4:
                curr_tile_y -= 1;
                break;
            default:
                break;
        }
    }
}

float clamp(float value, float min, float max) {
    return value < min ? min : (value > max ? max : value);
}

// Helper function to calculate color based on distance
sg_color calculate_color(int x, int y) {
    float distance = sqrt(x * x + y * y);
    float blue_intensity = clamp(distance / MAX_DISTANCE_COLOR, 0.0f, 1.0f);
    return (sg_color){0.1f, 0.1f, blue_intensity, 1.0f};
}

static void frame(void) {
    const int width = sapp_width();
    const int height = sapp_height();

     simgui_new_frame(&(simgui_frame_desc_t){
        .width = sapp_width(),
        .height = sapp_height(),
        .delta_time = sapp_frame_duration(),
        .dpi_scale = sapp_dpi_scale(),
    });

    
    const int cols = width / TILE_WIDTH;
    const int rows = height / TILE_HEIGHT;

    
    
    sgp_begin(width, height);
    sgp_viewport(0, 0, width, height);
    sgp_scale(3.0f, 3.0f);
    sgp_clear();
    sgp_set_image(0, tile_map[(int)curr_tile_x][curr_tile_y]);
    for (int y = 0; y < rows; y++) {
        for (int x = 0; x < cols; x++) {
            int tile_x = x + (int)pos_offset_x;
            int tile_y = y + (int)pos_offset_y;
            sg_color tile_color = calculate_color(tile_x, tile_y);
            sgp_draw_filled_rect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        }
    }

    
    // igSetNextWindowPos((ImVec2){10,10}, ImGuiCond_Once, (ImVec2){0,0});
    // igSetNextWindowSize((ImVec2){150, 600}, ImGuiCond_Once);
    igBegin("Debug Window", 0, ImGuiWindowFlags_None);
    igText("App Width: %d", width);
    igText("App Height: %d", height);
    igText("Pos X: %d", (int)pos_offset_x);
    igText("Pos Y: %d", (int)pos_offset_y);
    igText("Tile Width: %d", TILE_WIDTH );
    igText("Tile Rows: %d", rows);
    igText("Tile Cols: %d", cols);
    igText("Curr Tile X: %d", curr_tile_x);
    igText("Curr Tile Y: %d", curr_tile_y);
    igEnd();
    

    sg_pass pass = {.swapchain = sglue_swapchain()};
    
    sgp_reset_image(0);                        /* Resets current bound image in a texture channel to default (white texture). */

    sg_begin_pass(&pass);
    sgp_flush();
    sgp_end();
    simgui_render();
    sg_end_pass();
    sg_commit();
}

static void init(void) {
    // Initialize Sokol GFX.
    sg_desc sgdesc = {
        .environment = sglue_environment(),
        .logger.func = slog_func,
        .image_pool_size = 7000
    };
    sg_setup(&sgdesc);
    if (!sg_isvalid()) {
        fprintf(stderr, "Failed to create Sokol GFX context!\n");
        exit(-1);
    }

    simgui_setup(&(simgui_desc_t){ 0 });

    state.pass_action = (sg_pass_action) {
        .colors[0] = { .load_action = SG_LOADACTION_CLEAR, .clear_value = { 0.0f, 0.5f, 1.0f, 1.0 } }
    };

    // Initialize Sokol GP, adjust the size of command buffers for your own use.
    sgp_desc sgpdesc = {
            .max_vertices = 95560,  // Increase based on your needs
            .max_commands = 14096,   // Increase based on your needs
    };
    sgp_setup(&sgpdesc);
    if (!sgp_is_valid()) {
        fprintf(stderr, "Failed to create Sokol GP context: %s\n", sgp_get_error_message(sgp_get_last_error()));
        exit(-1);
    }
    extract_tiles();
}

// Called when the application is shutting down.
static void cleanup(void) {
    // Cleanup Sokol GP and Sokol GFX resources.
    sgp_shutdown();
    sg_shutdown();
    simgui_shutdown();
}

// Implement application main through Sokol APP.
sapp_desc sokol_main(int argc, char* argv[]) {
        (void)argc;
        (void)argv;
        return (sapp_desc){
            .init_cb = init,
            .frame_cb = frame,
            .cleanup_cb = cleanup,
            .event_cb = input,
            .window_title = "Rectangle (Sokol GP)",
            .logger.func = slog_func,
        };
    }