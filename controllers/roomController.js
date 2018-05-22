var Room = require('../models/rooms');

// Display list of all Rooms.
exports.room_list = function(req, res) {
    Room.find(function(err, rooms){
        if (err){
            res.send(err); 
        }
        res.json(rooms); 
    })
};

// Display detail page for a specific Room.
exports.room_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Room detail: ' + req.params.id);
};

// Display Room create form on GET.
exports.room_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Room create GET');
};

// Handle Room create on POST.
exports.room_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Room create POST');
};

// Display Room delete form on GET.
exports.room_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Room delete GET');
};

// Handle Room delete on POST.
exports.room_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Room delete POST');
};

// Display Room update form on GET.
exports.room_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Room update GET');
};

// Handle Room update on POST.
exports.room_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Room update POST');
};