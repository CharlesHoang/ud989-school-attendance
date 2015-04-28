(function(){
	var model = {
		studentRecords: [{studentName: "Slappy the Frog", attendance: [], daysMissed: 0},
					 {studentName: "Lilly the Lizard", attendance: [], daysMissed: 0},
					 {studentName: "Paulrus the Walrus", attendance: [], daysMissed: 0},
					 {studentName: "Gregory the Goat", attendance: [], daysMissed: 0},
					 {studentName: "Adam the Anaconda", attendance: [], daysMissed: 0}],
		
		init: function(){
			var cached = localStorage.getItem("attendanceRecord");
			
			if (cached)
				this.studentRecords = JSON.parse(cached);
				
			else{
				this.studentRecords.forEach(function(record){
					var present = false;
					for (var i = 0; i < 14; i ++){
						Math.random() > 0.5 ? present = false : present = true;
						if (!present) record.daysMissed++;
						record.attendance.push(present);
					}
				});
			}
			
			localStorage.setItem("attendanceRecord", JSON.stringify(this.studentRecords));
		}
	};
	
	var controller = {
		getStudentRecords: function(){
			return JSON.parse(localStorage.getItem("attendanceRecord"));
		}, 
		
		setStudentRecords: function(data){
			localStorage.setItem("attendanceRecord", JSON.stringify(data));
		},
		
		getStudentRecord: function(name){
			return controller.getStudentRecords().filter(function(record){
				return record.studentName == name;
			})[0];
		},
		
		getStudentRecordIndex: function(name){
			var index; 
			controller.getStudentRecords().forEach(function(record, pos){
				if (record.studentName == name)
					index = pos;
			});
			return index;
		},
		
		setDayMissed: function (name, day, present, event){
			var records = controller.getStudentRecords()
			var record = records[controller.getStudentRecordIndex(name)];
			record.attendance[day-1] = present;
			if(present)
				record.daysMissed --;
			else
				record.daysMissed++;
			controller.setStudentRecords(records);
			view.renderDaysMissed(record, event);
		},
		
		init: function(){
			model.init();
			view.init();
		}
	};
	
	var view = {
		init: function(){
			var data = controller.getStudentRecords();
			this.table = document.querySelector("table");
			this.thead = document.querySelector("thead");
			this.tbody = document.querySelector("tbody");
			this.templateRow = document.querySelector(".template-student-row");
			
			
			//Generate table headers
			this.header = this.thead.children[0];
			var lastSibling = this.header.children[1];
			for (var i = 0; i < data[0].attendance.length; i ++){
				var th = document.createElement("th");
				th.textContent = i + 1;
				this.header.insertBefore(th, lastSibling );	
			}
			
			this.renderTable(data);
			
		}, 
		
		renderDaysMissed:function(record, event){
			var recordRow = event.target.parentNode.parentNode.children
			recordRow[recordRow.length-1].textContent = record.daysMissed;
			
		}, 
		
		renderTable: function(data){
			//Clear existing table data
			this.tbody.innerHTML = "";
			
			data.forEach(function(record){
				var tr = view.templateRow.cloneNode(true).children[0];
				tr.innerHTML= tr.innerHTML.replace(/\{\{(\w+)\}\}/g, function(_,match){
					return record[match];
				});
				
				var checkboxTd = tr.removeChild(tr.querySelector(".attend-col"));
				var lastSibling = tr.querySelector(".missed-col")
				for (var i = 0; i < record.attendance.length; i++){
					var newCheckboxTd = checkboxTd.cloneNode(true);
					var checkbox = newCheckboxTd.querySelector("input");
					if (record.attendance[i]) checkbox.checked = true;
					
					checkbox.addEventListener("change", function(event){
						var checkboxRow = event.target.parentNode.parentNode.children
						var checkboxTd = event.target.parentNode;
						var name = checkboxRow[0].textContent;
						var day = Array.prototype.indexOf.call(checkboxRow, checkboxTd);
						var present = event.target.checked;
						controller.setDayMissed(name,day, present, event);
						});
					
					tr.insertBefore(newCheckboxTd, lastSibling)
				}
				
				view.tbody.appendChild(tr);
				
			});
			
		}
		
	};
	
	controller.init();
})();

