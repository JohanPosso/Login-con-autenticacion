
$(document).ready(function(){

	var lv = new LoginValidator();
	var lc = new LoginController();

// main login form //

	$('#login').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (lv.validateForm() == false){
				return false;
			} 	else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value:$('#btn_remember').find('span').hasClass('fa-check-square')});
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/home';
		},
		error : function(e){
			lv.showLoginError('Fallo de inicio de sesión', 'Por favor verifique su nombre de usuario y/o contraseña');
		}
	});

	$("input:text:visible:first").focus();
	$('#btn_remember').click(function(){
		var span = $(this).find('span');
		if (span.hasClass('fa-minus-square')){
			span.removeClass('fa-minus-square');
			span.addClass('fa-check-square');
		}	else{
			span.addClass('fa-minus-square');
			span.removeClass('fa-check-square');
		}
	});

// login retrieval form via email //

	var ev = new EmailValidator();

	$('#get-credentials-form').ajaxForm({
		url: '/lost-password',
		beforeSubmit : function(formData, jqForm, options){
			if (ev.validateEmail($('#email-tf').val())){
				ev.hideEmailAlert();
				return true;
			}	else{
				ev.showEmailAlert("Por favor, introduce una dirección de correo electrónico válida");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			$('#cancel').html('Aceptar');
			$('#retrieve-password-submit').hide();
			ev.showEmailSuccess("Se le envió por correo electrónico un enlace para restablecer su contraseña.");
		},
		error : function(e){
			if (e.responseText == 'Cuenta no encontrada'){
				ev.showEmailAlert("El correo electrónico no encontrado. ¿Estás seguro de que lo ingresaste correctamente?");
			}	else{
				$('#cancel').html('Aceptar');
				$('#retrieve-password-submit').hide();
				ev.showEmailAlert("Lo siento. Hubo un problema, inténtalo de nuevo más tarde");
			}
		}
	});

});
