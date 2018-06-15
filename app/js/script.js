$(document).ready(function () {
    var shop = window.location.href;
    var url = new URL(shop);
    console.log(url.searchParams.get("shop"));
    if (url.searchParams.get("shop") != null) {
        $('#shopname').text('Shop: ' + shop);
    } else {
        $('#holder').remove();
        $('#results').attr('style', 'display:block;');
        $('#results').html('<center><strong>Bạn không có quyền truy cập ứng dụng này</strong></center>');
    }
});

var API_IMG = '/_api/image';
var API_PRODUCT = '/_api/product';
var API_COLLECTION = '/_api/collections?page=1&limit=10';
var API_FIND_COLLECTION = '/_api/collections/find';

function uploadImg(file) {
    var random = Math.random().toString(36).substring(7);
    var randomDel = Math.random().toString(36).substring(7);
    $("#results").prepend(generateBlockAddProduct(random, randomDel));
    console.log("Uploading image ...");
    var formData = new FormData();
    formData.append("file", file);
    $.ajax({
        url: API_IMG,
        type: "POST",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response){
            $('#' + random + ' #' + randomDel).find('img').attr('src', response);
        },
        error: function(response, message){
            console.log(response + ' - ' + message);
        }
    });
}

$('#holder').on({
    'dragover dragenter': function(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    'drop': function(e) {
        var dataTransfer = e.originalEvent.dataTransfer;
        if (dataTransfer && dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();
            if (dataTransfer.files.length <= 20) {
                $.each(dataTransfer.files, function(i, file) {
                    validateFile(file);
                });
            } else {
                swal('Error!', 'Bạn chỉ có thể chọn tối đa 20 hình ảnh!', 'error');
            }
        }
    }
});

function validateFile(file) {
    if (file.size/1024/1024 > 2) {
        swal('Error!', 'Ảnh sản phẩm phải nhỏ hơn 2MB, vui lòng kiểm tra lại!', 'error');
    } else {
        uploadImg(file);
        afterDrop();
    }
}

$("#fileSelect").change(function(e) {
    var file = e.target.files;
    if (file.length <= 20) {
        $.each(file, function(i, file) {
            validateFile(file);
        });
    } else {
        swal('Error!', 'Bạn chỉ có thể chọn tối đa 20 hình ảnh!', 'error');
    }
});

function selectImg(id) {
    $('#' + id).find('input[name="' + id + '"]').change(function(e) {
        e.preventDefault();
        var file = e.target.files;
        $.each(file, function(i, file) {
            if (file.size/1024/1024 > 2) {
                swal('Error!', 'Ảnh sản phẩm phải nhỏ hơn 2MB, vui lòng kiểm tra lại!', 'error');
            } else {
                var randomDel = Math.random().toString(36).substring(7);
                console.log("Uploading image ...");
                var formData = new FormData();
                formData.append("file", file);
                $.ajax({
                    url: API_IMG,
                    type: "POST",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(response){
                        var data = "";
                        var img = "<img class='anh' src='" + response + "' width='100%'/>";
                        data += '<div class="col-md-4">';
                            data += '<div id="' + randomDel + '">';
                                data += img;
                                data += '<span data-toggle="tooltip" data-placement="bottom" title="Xóa ảnh" class="glyphicon glyphicon-remove" onclick="removeImg(\'' + randomDel + '\')"></span>';
                            data += '</div>';
                        data += '</div>';
                        if ($('#' + id + ' .firstImg').find('img').length == 0) {
                            var img = "<img  class='anh' src='" + response + "' width='100%'/>";
                            var output = "";
                            output += '<div id="' + randomDel + '">';
                                output += img;
                                output += '<span data-toggle="tooltip" data-placement="bottom" title="Xóa ảnh" class="glyphicon glyphicon-remove" onclick="removeImg(\'' + randomDel + '\')"></span>';
                            output += '</div>';
                            $('#' + id + ' .firstImg').append(output);
                        } else {
                            $('#' + id + ' .secondImg').append(data);
                        }
                    },
                    error: function(response, message){
                        console.log(response + ' - ' + message);
                    }
                });
            }
        });
        $('#' + id).find('input[name="' + id + '"]').val("");
    });
};

function afterDrop() {
    $('#holder').attr('style', 'display:none;');
    $('#results').attr('style', 'display:block;');
    var data = "";
    data += '<nav class="menuFixed">';
        data += '<button class="btn btn-danger" onclick="cancelAddProduct()">Hủy</button>';
        data += '<button class="btn btn-success" onclick="addAll()">Thêm tất cả sản phẩm</button>';
        data += '<button class="btn btn-info" id="countProduct" disabled>Tổng số: ' + updateCountProduct() + '/20 sản phẩm</button>';
    data += '</nav>';
    $('#results').append(data);
    $.getScript('js/ckeditor.js', function (data, textStatus, jqxhr) {
    });
    $('[data-toggle="tooltip"]').tooltip();  
};

function updateCountProduct() {
    return $(document).find('.formProduct').length;
}

function generateBlockAddProduct(random, randomDel) {
    var output = "";
    output += '<div class="row formProduct" id="' + random + '">';
        output += '<div class="col-xs-6 col-md-4 colImg">';
            output += '<div class="firstImg">';
                output += '<div id="' + randomDel + '">';
                    output += '<img  class="anh" src="img/gifload.gif" width="100%"/>';
                    output += '<span data-toggle="tooltip" data-placement="bottom" title="Xóa ảnh" class="glyphicon glyphicon-remove" onclick="removeImg(\'' + randomDel + '\')"></span>';
                output += '</div>';
            output += '</div>';
            output += '<div class="secondImg">';
            output += '</div>';
            output += '<div class="addMoreImg">';
                output += '<label class="btn btn-success">Thêm hình <input name="' + random + '" onclick="selectImg(\'' + random + '\')" type="file" style="display: none;" accept="image/*" multiple data-max-size="2000"></label>';
            output += '</div>';
        output += '</div>';
        output += '<div class="col-xs-12 col-md-8">';
            output += '<div class="row">';
                output += '<div class="form-group col-md-12">';
                    output += '<label>Tên sản phẩm</label>';
                    output += '<input type="text" name="title" class="form-control" placeholder="Táo Đỏ Haravan" />';
                output += '</div>';
                output += '<div class="col-md-12 description" style="margin-bottom: 15px;">';
                    output += '<label>Mô tả</label>';
                    output += '<textarea class="editor1" id="editor' + random + '"></textarea>';
                output += '</div>';
                output += '<hr/>';
                output += '<div class="col-xs-6 col-md-6">';
                    output += '<div class="form-group">';
                        output += '<label>Giá</label>';
                        output += '<input type="number" name="price" class="form-control" placeholder="đ" />';
                    output += '</div>';
                output += '</div>';
                output += '<div class="col-xs-6 col-md-6">';
                    output += '<div class="form-group">';
                        output += '<label>Giá so sánh</label>';
                        output += '<input type="number" name="priceSS" class="form-control" placeholder="đ" />';
                    output += '</div>';
                output += '</div>';
                output += '<div class="col-xs-6 col-md-6">';
                    output += '<div class="form-group">';
                        output += '<label>Mã sản phẩm</label>';
                        output += '<input type="text" name="masanpham" class="form-control" placeholder="ABC123" />';
                    output += '</div>';
                output += '</div>';
                output += '<div class="col-xs-6 col-md-6">';
                    output += '<div class="form-group">';
                        output += '<label>Loại sản phẩm</label>';
                        output += '<input type="text" name="product_type" class="form-control" placeholder="Khác" />';
                    output += '</div>';
                output += '</div>';
                output += '<div class="col-xs-6 col-md-6">';
                    output += '<div class="form-group">';
                        output += '<label>Nhà sản xuất</label>';
                        output += '<input type="text" name="vendor" class="form-control" placeholder="Haravan" />';
                    output += '</div>';
                output += '</div>';
                output += '<div class="col-xs-6 col-md-6">';
                    output += '<div class="form-group">';
                        output += '<label>Nhóm sản phẩm</label>';
                        output += '<div class="form-group dropdown">';
                            output += '<button onclick="getCollections(\'' + random + '\')" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">Chọn nhóm sản phẩm &nbsp;<span class="caret"></span></button>';
                            output += '<ul class="dropdown-menu">';
                                output += '<div id="querySearch"><li><input class="form-control" type="text" placeholder="Tìm kiếm nhóm sản phẩm" onkeyup="findCollection(this,\'' + random + '\')"/></li></div>';
                                output += '<div id="resultsCollections">';
                                    output += '<li class="loading"><img src="img/load.gif" height="50px"/></li>';
                                output += '</div>';
                            output += '</ul>';
                        output += '</div>';
                    output += '</div>';
                output += '</div>';
                output += '<div class="col-xs-6 col-md-6">';
                    output += '<div class="form-group" id="rsCol">';
                    output += '</div>';
                output += '</div>';
                output += '<div class="col-md-12">';
                    output += '<a href="javascript:addBlockAdvanced(\'' + random + '\')" class="btn btn-info btn-add">Thông tin nâng cao</a>';
                    output += '<a href="javascript:removeBlockAdvanced(\'' + random + '\')" class="btn btn-danger btn-remove" style="display: none;">Ẩn</a>';
                output += '</div>';
            output += '</div>';
            output += '<div id="nangcao">';
            output += '</div>';
        output += '</div>';
    output += '</div>';
    output += '<div class="row saveProduct ' + random + '">';
        output += '<button class="btn btn-success addAll" onclick="saveProduct(\'' + random + '\')">Lưu</button>';
        output += '<button class="btn btn-danger" style="margin-left:5px;" onclick="deleteProduct(\'' + random + '\')">Xóa sản phẩm</button>';
    output += '</div>';
    return output;
}

function addBlockAdvanced(id) {
    $('#' + id).find('#nangcao').html(generateBlockAdvanced(id));
    $('#' + id).find('.btn-add').attr('style', 'display:none;');
    $('#' + id).find('.btn-remove').attr('style', 'display:inline;line-height:4;');
}

function removeBlockAdvanced(id) {
    $('#' + id).find('#nangcao').html('');
    $('#' + id).find('.btn-add').attr('style', 'display:inline;');
    $('#' + id).find('.btn-remove').attr('style', 'display:none;');
}

function generateBlockAdvanced(id) {
    var output = "";
    output += '<div class="row">';
        output += '<div class="col-xs-6 col-md-6">';
            output += '<div class="form-group">';
                output += '<label>Nhãn</label>';
                output += '<input type="text" name="tags" class="form-control"/>';
            output += '</div>';
        output += '</div>';
        output += '<div class="col-md-6 col-xs-6">';
            output += '<div class="form-group">';
                output += '<label>Khối lượng (grams)</label>';
                output += '<input type="number" name="khoiluong" class="form-control" />';
            output += '</div>';
        output += '</div>';
        output += '<div class="col-xs-6 col-md-6">';
            output += '<label>Chính sách tồn kho</label>';
            output += '<select class="form-control" id="tonkho" onchange="funcTonkho(this, \'' + id + '\')">';
                output += '<option selected value="1">Không quản lý tồn kho</option>';
                output += '<option value="2">Có quản lý tồn kho</option>';
            output += '</select>';
        output += '</div>';
        output += '<div class="col-md-6 col-xs-6" id="quantity">';
            output += '<div class="form-group" style="">';
                output += '<label>Số lượng</label>';
                output += '<input type="number" class="form-control" name="tonkho"/>';
            output += '</div>';
        output += '</div>';
        output += '<div class="col-md-9 col-xs-9">';
            output += '<div class="form-group">';
                output += '<label>Sản phẩm có nhiều phiên bản</label>';
                output += '<br/>';
                output += '<span style="color: #9fafba">Sản phẩm có các phiên bản dựa theo thuộc tính như kích thước hoặc màu sắc ?</span>';
            output += '</div>';
        output += '</div>';
        output += '<div class="col-xs-3 col-md-3">';
            output += '<button class="btn btn-success btn-addVariants" onclick="addVariants(\'' + id + '\')">Thêm phiên bản</button>';
            output += '<button class="btn btn-danger btn-removeVariants" onclick="removeVariants(\'' + id + '\')" style="display:none;">Ẩn</button>';
        output += '</div>';
    output += '</div>';
    output += '<div class="hideOnClick">';
        output += '<div class="row">';
            output += '<div class="form-group">';
                output += '<div class="col-md-3">';
                    output += '<p>Tên thuộc tính</p>';
                output += '</div>';
                output += '<div class="col-md-9">';
                    output += '<p>Giá trị thuộc tính (Các giá trị cách nhau bởi dấu phẩy)</p>';
                output += '</div>';
            output += '</div>';
            output += '<div class="form-group" id="resVariants">';
                
            output += '</div>';
            output += '<div class="row addVariants" style="margin-bottom: 10px; margin-left:0;">';
                output += '<div class="col-md-3">';
                    output += '<button class="btn btn-default" onclick="addMoreVariant(\'' + id + '\')">Thêm thuộc tính khác</button>';
                output += '</div>';
            output += '</div>';
        output += '</div>';
        output += '<div class="row" id="resultsVariants">';
            output += '<p style="margin-left: 15px;">Chỉnh sửa mẫu sản phẩm để khởi tạo</p>';
            output += '<div class="row" style="margin-left: 0">';
                output += '<div class="col-md-1"></div>';
                output += '<div class="col-md-3">';
                    output += '<p>Mẫu sản phẩm </p>';
                output += '</div>';
                output += '<div class="col-md-2">';
                    output += '<p>Giá cả</p>';
                output += '</div>';
                output += '<div class="col-md-2">';
                    output += '<p>Mã sản phẩm</p>';
                output += '</div>';
                output += '<div class="col-md-2">';
                    output += '<p>Barcode</p>';
                output += '</div>';
                output += '<div class="col-md-2">';
                    output += '<p>Số lượng</p>';
                output += '</div>';
            output += '</div>';
            output += '<div id="resOptions">';
            output += '</div>';
        output += '</div>';
    output += '</div>';
    return output;
}

function addVariants(id) {
    var idran = Math.random().toString(36).substring(7);
    $('#' + id).find('.hideOnClick').attr('style', 'display:block');
    $('#' + id).find('.btn-addVariants').attr('style', 'display:none;');
    $('#' + id).find('.btn-removeVariants').attr('style', 'display:block');
    var optionArr = ["Tiêu đề", "Kích thước", "Màu sắc", "Vật liệu", "Kiểu dáng"];

    var data = "";

    var select = "";
    select += '<div class="col-md-3">';
        select += '<select class="form-control" id="option' + id + '">';
        optionArr.forEach(function (value) {
            select += '<option>' + value + '</option>';
        });
        select += '</select>';
    select += '</div>';


    var input = "";
    input += '<div class="col-md-7">';
        input += '<input type="text" name="option' + id + '" class="form-control" onkeyup="funcVariants(\'' + id + '\')"/>';
    input += '</div>';

    data += '<div class="row variants" id="' + idran + '" style="margin-bottom: 10px; margin-left:0;">';
        data += select;
        data += input;
        data += '<div class="col-md-2" style="text-align: center;">';
            data += '<button class="btn btn-danger" onclick="removeVrs(\'' + idran + '\')"><span class="glyphicon glyphicon-trash"></span></button>';
        data += '</div>';
    data += '</div>';

    $('#' + id).find('#resVariants').html(data);
}

function addMoreVariant(id) {
    var idran = Math.random().toString(36).substring(7);
    var optionArr = ["Tiêu đề", "Kích thước", "Màu sắc", "Vật liệu", "Kiểu dáng"];

    var data = "";

    var vrs = $('#' + id + ' .variants').find('select option:selected').map(function () {
        return $(this).text();
    });

    var select = "";
    select += '<div class="col-md-3">';
        select += '<select class="form-control" id="option' + id + '">';
        optionArr.forEach(function (value) {
            var bool = false;
            for (var i = 0; i < vrs.length; i++) {
                if (vrs[i] == value) {
                    bool = true;
                }
            }
            if (bool) {
                select += '<option disabled>' + value + '</option>';
            } else {
                select += '<option>' + value + '</option>';       
            }
        });
        select += '</select>';
    select += '</div>';

    var input = "";
    input += '<div class="col-md-7">';
        input += '<input type="text" name="option' + id + '" class="form-control" onkeyup="funcVariants(\'' + id + '\')"/>';
    input += '</div>';

    data += '<div class="row variants" id="' + idran + '" style="margin-bottom: 10px; margin-left:0;">';
        data += select;
        data += input;
        data += '<div class="col-md-2" style="text-align: center;">';
            data += '<button class="btn btn-danger" onclick="removeVrs(\'' + idran + '\', \'' + id + '\')"><span class="glyphicon glyphicon-trash"></span></button>';
        data += '</div>';
    data += '</div>';

    $('#' + id).find('#resVariants').append(data);

    if ($('#' + id + ' .variants').find('select').length == 3) {
        $('#' + id).find('.addVariants').attr('style', 'display:none;');
    }
}

function removeImg(id) {
    var src = $('#' + id).find('img.anh').attr('src');
    deleteImgFirebase(src);
    $('#' + id).remove();  
};

function removeVariants(id) {
    $('#' + id).find('.hideOnClick').attr('style', 'display:none');
    $('#' + id).find('.btn-addVariants').attr('style', 'display:block;');
    $('#' + id).find('.btn-removeVariants').attr('style', 'display:none');
}

function removeVrs(idran, id) {
    $('#' + idran).remove();
    if ($('#' + idran).find('select').length != 3) {
        $('#' + id).find('.addVariants').attr('style', 'display:block;');
    }
    funcVariants(id);
}

function funcTonkho(abc, id) {
    if (abc.value == "2") {
        $('#' + id + ' .row').find('#quantity').attr('style', 'display:block;');
    } else if (abc.value == "1") {
        $('#' + id + ' .row').find('#quantity').attr('style', 'display:none;');
    }
}

function allPossibleCases(arr) {
    if (arr.length === 0) {
        return [];
    }
    else if (arr.length === 1){
        return arr[0];
    } else {
        var result = [];
        var allCasesOfRest = allPossibleCases(arr.slice(1));
        for (var c in allCasesOfRest) {
            for (var i = 0; i < arr[0].length; i++) {
                result.push(arr[0][i] + '//' + allCasesOfRest[c]);
            }
        }
        return result;
    }
}

function funcVariants(id) {
    var input = $('#' + id).find('input[name=option' + id + ']').map(function () {
        return this.value;
    }).get();
    var arr = [];
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    if (input[0] != undefined) {
        var ip1 = input[0].split(',');
        ip1.forEach(function (value) {
            arr1.push(value);
        });
    }
    if (input[1] != undefined) {
        var ip2 = input[1].split(',');
        ip2.forEach(function (value) {
            arr2.push(value);
        });
    }
    if (input[2] != undefined) {
        var ip3 = input[2].split(',');
        ip3.forEach(function (value) {
            arr3.push(value);
        });
    }
    if (arr1.length != 0) {
        arr.push(arr1);
    }
    if (arr2.length != 0) {
        arr.push(arr2);
    }
    if (arr3.length != 0) {
        arr.push(arr3);
    }
    var output = "";
    var price = $('#' + id).find('input[name=price]').val();
    var masanpham = $('#' + id).find('input[name=masanpham]').val();
    var tonkho = $('#' + id).find('input[name=tonkho]').val();
    var count = 1;
    allPossibleCases(arr).forEach(function (value) {
        var masanphamX = "";
        if (masanpham.length != 0) {
            masanphamX += (masanpham + ' - ' + count);
        }
        output += '<div class="row" style="margin-right: 0; margin-left: 0; margin-bottom: 10px;">';
            output += '<div class="col-md-1">';
                output += '<input type="checkbox" name="checkOption" checked="false"/>';
            output += '</div>';
            output += '<div class="col-md-3">';
                output += '<span style="color: #75a630">' + value + '</span>';
            output += '</div>';
            output += '<div class="col-md-2">';
                output += '<input type="text" name="priceOption" class="form-control" placeholder="đ" value="' + price + '"/>';
            output += '</div>';
            output += '<div class="col-md-2">';
                output += '<input type="text" name="idOption" class="form-control" value="' + masanphamX + '"/>';
            output += '</div>';
            output += '<div class="col-md-2">';
                output += '<input type="text" name="barcodeOption" class="form-control"/>';
            output += '</div>';
            output += '<div class="col-md-2">';
                output += '<input type="number" name="quantityOption" class="form-control" value="' + tonkho + '"/>';
            output += '</div>';
        output += '</div>';
        count++;
    });
    $('#' + id).find('#resOptions').html(output);
};

function validateForm(title, product_type) {
    if (title.length != 0 && product_type.length != 0) {
        return true;
    } else {
        return false;
    }
};

function saveProduct(id) {
    var title = $('#' + id).find('input[name="title"]').val();
    var description = CKEDITOR.instances['editor' + id].getData();
    var price = $('#' + id).find('input[name="price"]').val();
    var vendor = $('#' + id).find('input[name="vendor"]').val();
    var product_type = $('#' + id).find('input[name="product_type"]').val();
    var images = $('#' + id).find('img.anh').map(function() { return this.src; }).get();
    var priceSS = $('#' + id).find('input[name="priceSS"]').val();
    var masanpham = $('#' + id).find('input[name="masanpham"]').val();
    var tonkho = $('#' + id).find('input[name="tonkho"]').val();
    var tags = $('#' + id).find('input[name="tags"]').val();
    var dataVariants = $('#' + id).find('#resOptions .row').map(function() { return $(this).find('span').text() + '/-mausanppham-/' + $(this).find('input[name=priceOption]').val() + '/-giaca-/' + $(this).find('input[name=idOption]').val() + '/-masanpham-/' + $(this).find('input[name=barcodeOption]').val() + '/-soluong-/' + $(this).find('input[name=quantityOption]').val() + '/-check-/' + $(this).find('input[name=checkOption]').is(':checked'); }).get();
    var dataOption = $('#' + id).find('.colSelect select').map(function() { return this.value; }).get();
    var dataCol = $('#' + id).find('button#dataCol').map(function () { return $(this).data('id') }).get();
    var inventory_management = "";
    if (tonkho != 0) {
        inventory_management += "haravan";
    }
    var variantsX = parseVariants(dataVariants, inventory_management);
    if (variantsX.length == 0) {
        var abc = {
            "compare_at_price": priceSS,
            "price": price,
            "sku": masanpham,
            "title": "Default Title",
            "option1": "Default Title",
            "inventory_management": inventory_management,
            "inventory_quantity": tonkho,
            "old_inventory_quantity": tonkho,
            "taxable":true
        }
        variantsX.push(abc);
    }
    if (validateForm(title, product_type)) {
        var post_data = {
            "product": {
                "title": title,
                "body_html": description,
                "vendor": vendor,
                "product_type": product_type,
                "tags": tags,
                "variants": variantsX,
                "images": parseImg(images),
                "options": parseOption(dataOption)
            }
        }
        $.ajax({
            url: API_PRODUCT,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(post_data),
            dataType: 'json',
            success: function(result) {
                swal("Success!", "Lưu sản phẩm thành công!", "success");
                if (dataCol.length != 0) {
                    dataCol.forEach(function (value) {
                        var collection_data = {
                            "collect": {
                                "product_id": result.product.id,
                                "collection_id": value
                            }
                        }
                        $.ajax({
                            url: API_COLLECTION,
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(collection_data),
                            dataType: 'json',
                            success: function(result) {
                                // console.log(result);
                            },
                            error: function(request, msg, error) {
                                console.log(request.responseText);
                            }
                        });
                    });
                }
                images.forEach(function (src) {
                    deleteImgFirebase(src);
                });
                // console.log(result);
            },
            error: function(request, msg, error) {
                swal("Error!", "Có lỗi xảy ra, vui lòng kiểm tra lại thông tin sản phẩm!", "error");
                console.log(request.responseText);
            }
        });
    } else {
        swal("Error!", "Tiêu đề và loại sản phẩm là trường bắt buộc!", "error");
    }
}

function parseOption(dataOption) {
    var arr = [];
    dataOption.forEach(function (value) {
        var data = "";
        if (value == "Tiêu đề") {
            data += "Title";
        } else if (value == "Kích thước") {
            data += "Size";
        } else if (value == "Màu sắc") {
            data += "Color";
        } else if (value == "Vật liệu") {
            data += "Material";
        } else if (value == "Kiểu dáng") {
            data += "Style";
        }
        var obj = {
            "name": data
        };
        arr.push(obj);
    });
    return arr;
}

function parseImg(img) {
    var arr = [];
    img.forEach(function (res) {
        var obj = {
            "src": res
        }
        arr.push(obj);
    });
    return arr;
}

function parseVariants(dataVariants, inventory_management) {
    var arr = [];
    dataVariants.forEach(function (res) {
        var mausanppham = res.split("/-mausanppham-/");
        var option = mausanppham[0].split("//");
        var option1 = option[0];
        var option2 = option[1];
        var option3 = option[2];
        var giaca = mausanppham[1].split("/-giaca-/");
        var masanpham = giaca[1].split("/-masanpham-/");
        var barcode = masanpham[1].split("/-soluong-/");
        var soluong = barcode[1].split("/-check-/");
        var check = soluong[1];
        var obj = {
            "barcode": barcode[0],
            "price": giaca[0],
            "sku": masanpham[0],
            "title": mausanppham[0],
            "option1": option1,
            "option2": option2,
            "option3": option3,
            "inventory_management": inventory_management,
            "inventory_quantity": soluong[0],
            "old_inventory_quantity": soluong[0],
            "taxable":true
        }
        if (check == 'true') {
            arr.push(obj);
        }
    });
    return arr;
}

function replaceStr(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

function findCollection(a, id) {
    $('#' + id).find('#resultsCollections').html('<li class="loading"><img src="img/load.gif" height="50px"/></li>');
    $.ajax({
        url: API_FIND_COLLECTION,
        type: "GET",
        success: function (response) {
            var collection = "";
            for (var i = 0; i < response.custom_collections.length; i++) {
                var title = response.custom_collections[i].title;
                var str = replaceStr(title);
                var valueStr = replaceStr(a.value.toLowerCase());
                var strRegex = str.toLowerCase();
                var patt = new RegExp(valueStr);
                if (str.length == 0) {
                    collection += '<li><a href="javascript:selectThis(\'' + title + '\', \'' + response.custom_collections[i].id + '\', \'' + id + '\')">' + title + '</a></li>';
                    $('#' + id).find('.loading').remove();
                    $('#' + id).find('#resultsCollections').html(collection);
                } else if (patt.test(strRegex) == true) {
                    collection += '<li><a href="javascript:selectThis(\'' + title + '\', \'' + response.custom_collections[i].id + '\', \'' + id + '\')">' + title + '</a></li>';
                    $('#' + id).find('.loading').remove();
                    $('#' + id).find('#resultsCollections').html(collection);
                } else {
                    collection += "";
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
}

function getCollections(id) {
    $.ajax({
        url: API_COLLECTION,
        type: "GET",
        success: function (response) {
            var collection = "";
            for (var i = 0; i < response.custom_collections.length; i++) {
                collection += '<li><a href="javascript:selectThis(\'' + response.custom_collections[i].title + '\', \'' + response.custom_collections[i].id + '\', \'' + id + '\')">' + response.custom_collections[i].title + '</a></li>';
            }
            $('#' + id).find('.loading').remove();
            $('#' + id).find('#resultsCollections').html(collection);
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
};

function checkDuplicate(id, cla) {
    var nsp = $('#' + cla).find('.getNsp').map(function () {
        return this.id;
    }).get();
    for (var i = 0; i < nsp.length; i++) {
        var idnsp = $('#' + nsp[i]).find('#dataCol').map(function () {
            return $(this).data().id;
        }).get();
        for (var j = 0; j < idnsp.length; j++) {
            if (idnsp[j] == id) {
                $('#' + nsp[i]).remove();
                return false;
            }
        }
    }
    return true;
}

function selectThis(val, id, cla) {
    if (checkDuplicate(id, cla)) {
        var ran = Math.random().toString(36).substring(7);
        var output = "";
        output += '<div class="btn-group getNsp" id="' + ran + '">';
            output += '<button type="button" class="btn btn-default" id="dataCol" data-id="' + id + '">' + val + '</button>';
            output += '<button type="button" class="btn btn-danger" onclick="removeThis(\'' + ran + '\')">X</button>';
        output += '</div>';
        $('#' + cla).find('#rsCol').append(output);
    }
};

function removeThis(id) {
    $('#' + id).remove();
};

function deleteImgFirebase(src) {
    var hostname = src.split('https://storage.googleapis.com/');
    var bucket = hostname[1].split('/');
    var name = bucket[1];
    $.ajax({
        url: API_IMG + '?bucket=' + bucket[0] + '&name=' + name,
        method: 'DELETE',
        success: function(result) {
            console.log(result);
        },
        error: function(request, msg, error) {
            console.log(request.responseText);
        }
    });
}

function cancelAddProduct() {
    var img = $('#results').find('img.anh').map(function () {
        return this.src;
    }).get();
    img.forEach(function (src) {
        deleteImgFirebase(src);
    });
    $('#holder').attr('style', 'display:block;');
    $('#results').attr('style', 'display:none;');
    $('#results').html('');
}

function addAll() {
    $(document).find('.addAll').click();
}

function deleteProduct(id, idran) {
    var value = $('#' + id).find('img.anh').map(function() { return this.src; }).get();
    value.forEach(function (src) {
        deleteImgFirebase(src)
    });
    $(document).find('#' + id).remove();
    $(document).find('.' + id).remove();
    $(document).find('#countProduct').text('Tổng số: ' + updateCountProduct() + '/20 sản phẩm');
    if ($(document).find('.formProduct').length == 0) {
        $('#holder').attr('style', 'display:block;');
        $('#results').attr('style', 'display:none;');
        $('#results').html('');
    }
}