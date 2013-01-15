/**
 * @author		New Media, QVC Inc.
 * @project		Limelight Discovery Tool
 * @version		0.1.0
 **/

$(function(d, w) {
	'use strict';
	// private configs
	var cfg = {
		proxy: true,
		urls: {
			content: 'http://www.qvc.com/qWebServices/Content.aspx',
			localcontent: '../../_playground/php/getContent.php'
		},
		qws: {
			app: 'IPAD2-0',
			version: 3,
			outputtype: 'JSON',
			panels: {
				mapping: 'MYQVC_DATAMAPPING_VIDEO',
				questions: 'MYQVC_SURVEYQA'
			}
		}
	};

	//app functions
	var app = {
		get domain() {
			return d.domain;
		},
		getQA: function() {
			$.ajax({
				url: (this.domain.indexOf('qvc.com')!=-1) ? cfg.urls.content : (cfg.urls.localcontent+'?BaseURL='+cfg.urls.content + (cfg.proxy ? '&qvcProxy=1' : '' )),
				data: {
					'Panel': cfg.qws.panels.questions,
					'App': cfg.qws.app,
					'Version': cfg.qws.version,
					'OutputType': cfg.qws.outputtype
				},
				dataType: 'json',
				timeout: 5000,
				success: function(data) {
					var qArr = data.ContentPanel.Questions[0].Question || null;

					for(var i=0; i<qArr.length; i++) {
						var html = [];
						
						for(var j=0; j<qArr[i].NavItem.length; j++) {
							var answer = qArr[i].NavItem[j];
							html.push('<option value="'+answer.ID+'">');
							html.push(answer.DisplayText);
							html.push('</option>');
						}
						
						$('#sqa_'+qArr[i].TargetType.toLowerCase()).html(html.join(''));
					}
				}
			});
		},
		init: function() {
			// get questions and answers from qWS
			this.getQA();

			// make it accessible in global namespace
			return this;
		}
	};

	return window.app = app.init();
}(document, window));